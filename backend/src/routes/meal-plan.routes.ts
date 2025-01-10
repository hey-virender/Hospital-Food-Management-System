import { Router } from 'express';
import { createMealPlan, getMealPlans,  updateMealPlan, deleteMealPlan, getMealPlansByPatientId } from '../controllers/meal-plan.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Create a new meal plan

router.post('/meal-plan', authMiddleware, createMealPlan);

// Get all meal plans
router.get('/meal-plan', authMiddleware, getMealPlans);

// Get a single meal plan by patient ID

// Get a single meal plan by ID
router.get('/meal-plan/:id', authMiddleware, getMealPlansByPatientId);

// Update a meal plan by ID
router.put('/meal-plan/:id', authMiddleware, updateMealPlan);

// Delete a meal plan by ID
router.delete('/meal-plan/:id', authMiddleware, deleteMealPlan);

export default router;
