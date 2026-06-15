import db from '../db';
import { Achievement } from '../types';

export interface UnlockedAchievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  reward_points: number;
}

function ensureUserAchievements(userId: number) {
  const achievements = db.prepare('SELECT * FROM achievements').all() as Achievement[];
  const insertStmt = db.prepare(
    'INSERT OR IGNORE INTO user_achievements (user_id, achievement_id, progress, unlocked, unlocked_at) VALUES (?, ?, 0, 0, NULL)'
  );
  for (const ach of achievements) {
    insertStmt.run(userId, ach.id);
  }
}

export function updateMileageAchievements(userId: number): UnlockedAchievement[] {
  ensureUserAchievements(userId);

  const user = db.prepare('SELECT total_km FROM users WHERE id = ?').get(userId) as { total_km: number };
  if (!user) return [];

  const achievements = db.prepare(
    "SELECT a.*, ua.unlocked as already_unlocked FROM achievements a LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ? WHERE a.type = 'mileage'"
  ).all(userId) as (Achievement & { already_unlocked: number })[];

  const newlyUnlocked: UnlockedAchievement[] = [];
  const updateStmt = db.prepare(
    'UPDATE user_achievements SET progress = ?, unlocked = 1, unlocked_at = datetime(\'now\') WHERE user_id = ? AND achievement_id = ?'
  );
  const progressStmt = db.prepare(
    'UPDATE user_achievements SET progress = ? WHERE user_id = ? AND achievement_id = ?'
  );

  for (const ach of achievements) {
    if (ach.already_unlocked) {
      progressStmt.run(user.total_km, userId, ach.id);
      continue;
    }
    if (user.total_km >= ach.target) {
      updateStmt.run(user.total_km, userId, ach.id);
      newlyUnlocked.push({
        id: ach.id,
        name: ach.name,
        description: ach.description,
        icon: ach.icon,
        reward_points: ach.reward_points,
      });
    } else {
      progressStmt.run(user.total_km, userId, ach.id);
    }
  }

  return newlyUnlocked;
}

export function updateActivityAchievements(userId: number): UnlockedAchievement[] {
  ensureUserAchievements(userId);

  const activityCount = db.prepare(
    "SELECT COUNT(*) as cnt FROM activity_participants WHERE user_id = ? AND status = 'going'"
  ).get(userId) as { cnt: number };

  const achievements = db.prepare(
    "SELECT a.*, ua.unlocked as already_unlocked FROM achievements a LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ? WHERE a.type = 'activity'"
  ).all(userId) as (Achievement & { already_unlocked: number })[];

  const newlyUnlocked: UnlockedAchievement[] = [];
  const updateStmt = db.prepare(
    'UPDATE user_achievements SET progress = ?, unlocked = 1, unlocked_at = datetime(\'now\') WHERE user_id = ? AND achievement_id = ?'
  );
  const progressStmt = db.prepare(
    'UPDATE user_achievements SET progress = ? WHERE user_id = ? AND achievement_id = ?'
  );

  for (const ach of achievements) {
    if (ach.already_unlocked) {
      progressStmt.run(activityCount.cnt, userId, ach.id);
      continue;
    }
    if (activityCount.cnt >= ach.target) {
      updateStmt.run(activityCount.cnt, userId, ach.id);
      newlyUnlocked.push({
        id: ach.id,
        name: ach.name,
        description: ach.description,
        icon: ach.icon,
        reward_points: ach.reward_points,
      });
    } else {
      progressStmt.run(activityCount.cnt, userId, ach.id);
    }
  }

  return newlyUnlocked;
}

export function getUserAchievements(userId: number) {
  ensureUserAchievements(userId);

  return db.prepare(`
    SELECT a.id, a.name, a.description, a.type, a.target, a.icon, a.reward_points,
           ua.progress, ua.unlocked, ua.unlocked_at
    FROM user_achievements ua
    JOIN achievements a ON ua.achievement_id = a.id
    WHERE ua.user_id = ?
    ORDER BY a.type, a.target
  `).all(userId);
}
