import { Router } from 'express';
import pool from '../config/database';
import { success, error } from '../utils/response';

const router = Router();

// 获取标签列表
router.get('/', async (req, res) => {
  try {
    const [tags] = await pool.execute(
      `SELECT 
        t.*,
        (SELECT COUNT(*) FROM article_tags WHERE tag_id = t.id) as article_count
      FROM tags t
      ORDER BY article_count DESC, t.name ASC`
    );
    
    res.json(success(tags));
  } catch (err) {
    console.error('Get tags error:', err);
    res.status(500).json(error('获取标签列表失败'));
  }
});

// 获取热门标签
router.get('/hot', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const [tags] = await pool.execute(
      `SELECT 
        t.*,
        (SELECT COUNT(*) FROM article_tags WHERE tag_id = t.id) as article_count
      FROM tags t
      ORDER BY article_count DESC
      LIMIT ?`,
      [limit]
    );
    
    res.json(success(tags));
  } catch (err) {
    console.error('Get hot tags error:', err);
    res.status(500).json(error('获取热门标签失败'));
  }
});

export default router;
