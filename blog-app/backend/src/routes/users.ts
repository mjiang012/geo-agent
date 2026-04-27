import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { authenticate } from '../middlewares/auth';
import { success, error, notFound, validationError } from '../utils/response';

const router = Router();

// 获取当前用户信息
router.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user!.userId;
    
    const [users] = await pool.execute(
      'SELECT id, username, email, avatar, role, bio, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    const user = (users as any[])[0];
    
    if (!user) {
      res.status(404).json(notFound('用户不存在'));
      return;
    }
    
    res.json(success(user));
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json(error('获取用户信息失败'));
  }
});

// 更新用户信息
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { username, email, bio, avatar } = req.body;
    
    // 检查用户名是否已被其他用户使用
    if (username) {
      const [existingUsers] = await pool.execute(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, userId]
      );
      
      if ((existingUsers as any[]).length > 0) {
        res.status(400).json(validationError('用户名已被使用'));
        return;
      }
    }
    
    // 检查邮箱是否已被其他用户使用
    if (email) {
      const [existingUsers] = await pool.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      
      if ((existingUsers as any[]).length > 0) {
        res.status(400).json(validationError('邮箱已被使用'));
        return;
      }
    }
    
    await pool.execute(
      'UPDATE users SET username = ?, email = ?, bio = ?, avatar = ? WHERE id = ?',
      [username, email, bio, avatar, userId]
    );
    
    res.json(success(null, '用户信息更新成功'));
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json(error('更新用户信息失败'));
  }
});

// 修改密码
router.put('/password', authenticate, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      res.status(400).json(validationError('原密码和新密码不能为空'));
      return;
    }
    
    if (newPassword.length < 6 || newPassword.length > 20) {
      res.status(400).json(validationError('新密码长度应在 6-20 个字符之间'));
      return;
    }
    
    // 验证原密码
    const [users] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );
    
    const user = (users as any[])[0];
    
    if (!user) {
      res.status(404).json(notFound('用户不存在'));
      return;
    }
    
    const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash);
    
    if (!isValidPassword) {
      res.status(400).json(validationError('原密码错误'));
      return;
    }
    
    // 更新密码
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, userId]
    );
    
    res.json(success(null, '密码修改成功'));
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json(error('修改密码失败'));
  }
});

// 获取我的文章列表
router.get('/articles', authenticate, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const status = req.query.status as string;
    
    const offset = (page - 1) * pageSize;
    
    let whereClause = 'WHERE a.author_id = ?';
    const params: any[] = [userId];
    
    if (status) {
      whereClause += ' AND a.status = ?';
      params.push(status);
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
        c.name as category_name,
        (SELECT COUNT(*) FROM comments WHERE article_id = a.id) as comment_count
      FROM articles a
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
    console.error('Get my articles error:', err);
    res.status(500).json(error('获取文章列表失败'));
  }
});

export default router;
