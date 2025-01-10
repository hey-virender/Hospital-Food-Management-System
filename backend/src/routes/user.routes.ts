import { Router } from 'express';
import { login, updateUser, getUserDetails, logout, signup } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Login route
router.post('/signup',signup)
router.post('/login', login);
// Update user details route
router.put('/update',authMiddleware, updateUser);

// Get user details route
router.get('/me',authMiddleware, getUserDetails);
router.get('/logout',logout)

export default router;