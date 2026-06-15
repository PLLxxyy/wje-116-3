import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import clubRoutes from './routes/clubs';
import activityRoutes from './routes/activities';
import postRoutes from './routes/posts';
import challengeRoutes from './routes/challenges';
import adminRoutes from './routes/admin';
import achievementRoutes from './routes/achievements';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/achievements', achievementRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
