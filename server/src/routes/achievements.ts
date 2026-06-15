import { Router, Request, Response } from 'express';
import db from '../db';
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from '../types';
import { getUserAchievements, updateMileageAchievements, updateActivityAchievements } from '../services/achievementService';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const achievements = db.prepare('SELECT * FROM achievements ORDER BY type, target').all();
    res.json(achievements);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const achievements = getUserAchievements(req.userId!);
    res.json(achievements);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId', (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: '无效的用户ID' });
    }
    const achievements = getUserAchievements(userId);
    res.json(achievements);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/check', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const mileageUnlocked = updateMileageAchievements(req.userId!);
    const activityUnlocked = updateActivityAchievements(req.userId!);
    const allUnlocked = [...mileageUnlocked, ...activityUnlocked];
    res.json({ newly_unlocked: allUnlocked });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
