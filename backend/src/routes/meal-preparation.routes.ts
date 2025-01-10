import { Router } from 'express';
import { createMealPreparation, getMealPreparations, getMealPreparationById, updateMealPreparation, deleteMealPreparation } from '../controllers/meal-preparation.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Create a new meal preparation record
router.post('/meal-preparation',authMiddleware, createMealPreparation);

// Get all meal preparations
router.get('/meal-preparation',authMiddleware, getMealPreparations);

// Get a single meal preparation by ID
router.get('/meal-preparation/:id',authMiddleware, getMealPreparationById);

// Update a meal preparation by ID
router.put('/meal-preparation/:id',authMiddleware, updateMealPreparation);

// Delete a meal preparation by ID
router.delete('/meal-preparation/:id',authMiddleware, deleteMealPreparation);

export default router;
