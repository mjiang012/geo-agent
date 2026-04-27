import { Router } from 'express';
import pool from '../config/database';
import { success, error } from '../utils/response';

const router = Router();

// 获取分类列表
router.get('/', async (req, res) => {
  try {
    const [categories] = await pool.execute(
      `SELECT 
        c.*,
        (SELECT COUNT(*) FROM articles WHERE category_id = c.id AND status = 'published') as article_count
      FROM categories c
      ORDER BY c.created_at ASC`
    );
    
    res.json(success(categories));
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json(error('获取分类列表失败'));
  }
});

export default router;
