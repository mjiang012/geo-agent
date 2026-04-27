import { Router } from 'express';
import pool from '../config/database';
import { authenticate } from '../middlewares/auth';
import { success, error, notFound, validationError } from '../utils/response';
import { ArticleWithAuthor } from '../types';

const router = Router();

// 获取文章列表
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const categoryId = req.query.categoryId as string;
    const keyword = req.query.keyword as string;
    const status = (req.query.status as string) || 'published';
    
    const offset = (page - 1) * pageSize;
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
      whereClause += ' AND a.status = ?';
      params.push(status);
    }
    
    if (categoryId) {
      whereClause += ' AND a.category_id = ?';
      params.push(categoryId);
    }
    
    if (keyword) {
      whereClause += ' AND (a.title LIKE ? OR a.content LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    
    // 获取总数
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM articles a ${whereClause}`,
      params
    );
    const total = (countResult as any[])[0].total;
    
    // 获取文章列表
    const [articles] = await pool.execute(
      `SELECT 
        a.*,
        u.username as author_username,
        u.avatar as author_avatar,
        c.name as category_name,
        (SELECT COUNT(*) FROM comments WHERE article_id = a.id) as comment_count
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );
    
    res.json(success({
      list: articles,
      pagination: {
        page,
        pageSize,
        total
      }
    }));
  } catch (err) {
    console.error('Get articles error:', err);
    res.status(500).json(error('获取文章列表失败'));
  }
});

// 获取文章详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 增加浏览量
    await pool.execute(
      'UPDATE articles SET view_count = view_count + 1 WHERE id = ?',
      [id]
    );
    
    const [articles] = await pool.execute(
      `SELECT 
        a.*,
        u.username as author_username,
        u.avatar as author_avatar,
        c.name as category_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = ?`,
      [id]
    );
    
    const article = (articles as ArticleWithAuthor[])[0];
    
    if (!article) {
      res.status(404).json(notFound('文章不存在'));
      return;
    }
    
    // 获取文章标签
    const [tags] = await pool.execute(
      `SELECT t.id, t.name 
       FROM tags t
       INNER JOIN article_tags at ON t.id = at.tag_id
       WHERE at.article_id = ?`,
      [id]
    );
    
    res.json(success({
      ...article,
      tags
    }));
  } catch (err) {
    console.error('Get article error:', err);
    res.status(500).json(error('获取文章详情失败'));
  }
});

// 创建文章
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, summary, coverImage, categoryId, tags, status } = req.body;
    const authorId = req.user!.userId;
    
    if (!title || !content) {
      res.status(400).json(validationError('标题和内容不能为空'));
      return;
    }
    
    const [result] = await pool.execute(
      `INSERT INTO articles (title, content, summary, cover_image, author_id, category_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, content, summary || null, coverImage || null, authorId, categoryId || null, status || 'draft']
    );
    
    const articleId = (result as any).insertId;
    
    // 添加标签关联
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // 查找或创建标签
        const [existingTags] = await pool.execute(
          'SELECT id FROM tags WHERE name = ?',
          [tagName]
        );
        
        let tagId;
        if ((existingTags as any[]).length > 0) {
          tagId = (existingTags as any[])[0].id;
        } else {
          const [tagResult] = await pool.execute(
            'INSERT INTO tags (name) VALUES (?)',
            [tagName]
          );
          tagId = (tagResult as any).insertId;
        }
        
        // 关联标签
        await pool.execute(
          'INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)',
          [articleId, tagId]
        );
      }
    }
    
    res.json(success({ id: articleId }, '文章创建成功'));
  } catch (err) {
    console.error('Create article error:', err);
    res.status(500).json(error('创建文章失败'));
  }
});

// 更新文章
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, summary, coverImage, categoryId, tags, status } = req.body;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    
    // 检查文章是否存在且属于当前用户
    const [articles] = await pool.execute(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    );
    
    const article = (articles as any[])[0];
    
    if (!article) {
      res.status(404).json(notFound('文章不存在'));
      return;
    }
    
    // 只有作者或管理员可以修改
    if (article.author_id !== userId && userRole !== 'admin') {
      res.status(403).json({ code: 403, message: '无权修改此文章' });
      return;
    }
    
    await pool.execute(
      `UPDATE articles 
       SET title = ?, content = ?, summary = ?, cover_image = ?, category_id = ?, status = ?
       WHERE id = ?`,
      [
        title || article.title,
        content || article.content,
        summary !== undefined ? summary : article.summary,
        coverImage !== undefined ? coverImage : article.cover_image,
        categoryId !== undefined ? categoryId : article.category_id,
        status || article.status,
        id
      ]
    );
    
    // 更新标签
    if (tags) {
      // 删除旧标签关联
      await pool.execute('DELETE FROM article_tags WHERE article_id = ?', [id]);
      
      // 添加新标签
      for (const tagName of tags) {
        const [existingTags] = await pool.execute(
          'SELECT id FROM tags WHERE name = ?',
          [tagName]
        );
        
        let tagId;
        if ((existingTags as any[]).length > 0) {
          tagId = (existingTags as any[])[0].id;
        } else {
          const [tagResult] = await pool.execute(
            'INSERT INTO tags (name) VALUES (?)',
            [tagName]
          );
          tagId = (tagResult as any).insertId;
        }
        
        await pool.execute(
          'INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)',
          [id, tagId]
        );
      }
    }
    
    res.json(success(null, '文章更新成功'));
  } catch (err) {
    console.error('Update article error:', err);
    res.status(500).json(error('更新文章失败'));
  }
});

// 删除文章
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    
    const [articles] = await pool.execute(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    );
    
    const article = (articles as any[])[0];
    
    if (!article) {
      res.status(404).json(notFound('文章不存在'));
      return;
    }
    
    if (article.author_id !== userId && userRole !== 'admin') {
      res.status(403).json({ code: 403, message: '无权删除此文章' });
      return;
    }
    
    await pool.execute('DELETE FROM articles WHERE id = ?', [id]);
    
    res.json(success(null, '文章删除成功'));
  } catch (err) {
    console.error('Delete article error:', err);
    res.status(500).json(error('删除文章失败'));
  }
});

export default router;
