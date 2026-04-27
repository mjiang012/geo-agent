import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { success, error, validationError } from '../utils/response';
import { User } from '../types';

const router = Router();

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      res.status(400).json(validationError('用户名、邮箱和密码不能为空'));
      return;
    }
    
    if (username.length < 3 || username.length > 20) {
      res.status(400).json(validationError('用户名长度应在 3-20 个字符之间'));
      return;
    }
    
    if (password.length < 6 || password.length > 20) {
      res.status(400).json(validationError('密码长度应在 6-20 个字符之间'));
      return;
    }
    
    // 检查用户名是否已存在
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if ((existingUsers as any[]).length > 0) {
      res.status(400).json(validationError('用户名或邮箱已被注册'));
      return;
    }
    
    // 加密密码
    const passwordHash = await bcrypt.hash(password, 10);
    
    // 创建用户
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, 'user']
    );
    
    const userId = (result as any).insertId;
    
    // 生成 JWT
    const token = jwt.sign(
      { userId, username, role: 'user' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'] }
    );
    
    res.json(success({
      id: userId,
      username,
      email,
      token
    }, '注册成功'));
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json(error('注册失败'));
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      res.status(400).json(validationError('用户名和密码不能为空'));
      return;
    }
    
    // 查找用户
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );
    
    const user = (users as User[])[0];
    
    if (!user) {
      res.status(400).json(validationError('用户名或密码错误'));
      return;
    }
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      res.status(400).json(validationError('用户名或密码错误'));
      return;
    }
    
    // 生成 JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'] }
    );
    
    res.json(success({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token
    }, '登录成功'));
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json(error('登录失败'));
  }
});

export default router;
