import { Router } from 'express';
import { createMealPlan, getMealPlans,  updateMealPlan, deleteMealPlan, getMealPlansByPatientId } from '../controllers/meal-plan.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
router.use(authMiddleware)

// Create a new meal plan

router.post('/meal-plan', createMealPlan);

// Get all meal plans
router.get('/meal-plan',  getMealPlans);

// Get a single meal plan by patient ID

// Get a single meal plan by ID
router.get('/meal-plan/:id', getMealPlansByPatientId);

// Update a meal plan by ID
router.put('/meal-plan/:id', updateMealPlan);

// Delete a meal plan by ID
router.delete('/meal-plan/:id',  deleteMealPlan);

export default router;
