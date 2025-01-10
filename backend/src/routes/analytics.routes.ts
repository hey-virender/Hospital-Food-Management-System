import { Router } from 'express';
import { getAnalytics } from './../controllers/analytics.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
router.use(authMiddleware)

// Analytics route
router.get('/analytics', getAnalytics);

export default router;
