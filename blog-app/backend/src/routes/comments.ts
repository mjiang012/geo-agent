import { Router } from 'express';
import pool from '../config/database';
import { authenticate } from '../middlewares/auth';
import { success, error, notFound, validationError } from '../utils/response';

const router = Router();

// 获取文章评论列表
router.get('/article/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    
    const [comments] = await pool.execute(
      `SELECT 
        c.*,
        u.username as author_username,
        u.avatar as author_avatar
      FROM comments c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.article_id = ?
      ORDER BY c.created_at DESC`,
      [articleId]
    );
    
    // 构建评论树
    const commentList = comments as any[];
    const rootComments: any[] = [];
    const commentMap = new Map();
    
    // 首先将所有评论放入 map
    commentList.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });
    
    // 构建树形结构
    commentList.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });
    
    res.json(success(rootComments));
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json(error('获取评论列表失败'));
  }
});

// 发表评论
router.post('/article/:articleId', authenticate, async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content, parentId } = req.body;
    const authorId = req.user!.userId;
    
    if (!content || content.trim().length === 0) {
      res.status(400).json(validationError('评论内容不能为空'));
      return;
    }
    
    // 检查文章是否存在
    const [articles] = await pool.execute(
      'SELECT id FROM articles WHERE id = ?',
      [articleId]
    );
    
    if ((articles as any[]).length === 0) {
      res.status(404).json(notFound('文章不存在'));
      return;
    }
    
    // 如果 parentId 存在，检查父评论是否存在
    if (parentId) {
      const [parentComments] = await pool.execute(
        'SELECT id FROM comments WHERE id = ? AND article_id = ?',
        [parentId, articleId]
      );
      
      if ((parentComments as any[]).length === 0) {
        res.status(400).json(validationError('父评论不存在'));
        return;
      }
    }
    
    const [result] = await pool.execute(
      'INSERT INTO comments (content, article_id, author_id, parent_id) VALUES (?, ?, ?, ?)',
      [content.trim(), articleId, authorId, parentId || null]
    );
    
    const commentId = (result as any).insertId;
    
    // 获取新创建的评论
    const [comments] = await pool.execute(
      `SELECT 
        c.*,
        u.username as author_username,
        u.avatar as author_avatar
      FROM comments c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.id = ?`,
      [commentId]
    );
    
    res.json(success((comments as any[])[0], '评论发表成功'));
  } catch (err) {
    console.error('Create comment error:', err);
    res.status(500).json(error('发表评论失败'));
  }
});

// 删除评论
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    
    const [comments] = await pool.execute(
      'SELECT * FROM comments WHERE id = ?',
      [id]
    );
    
    const comment = (comments as any[])[0];
    
    if (!comment) {
      res.status(404).json(notFound('评论不存在'));
      return;
    }
    
    // 只有评论作者或管理员可以删除
    if (comment.author_id !== userId && userRole !== 'admin') {
      res.status(403).json({ code: 403, message: '无权删除此评论' });
      return;
    }
    
    await pool.execute('DELETE FROM comments WHERE id = ?', [id]);
    
    res.json(success(null, '评论删除成功'));
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json(error('删除评论失败'));
  }
});

export default router;
