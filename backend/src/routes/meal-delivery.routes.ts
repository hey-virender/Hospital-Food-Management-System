import { Router } from 'express';
import { createMealDelivery, getMealDeliveries, getMealDeliveryById, updateMealDelivery, deleteMealDelivery } from '../controllers/meal-delivery.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Create a new meal delivery record
router.post('/meal-delivery',authMiddleware, createMealDelivery);

// Get all meal deliveries
router.get('/meal-delivery',authMiddleware, getMealDeliveries);

// Get a single meal delivery by ID
router.get('/meal-delivery/:id',authMiddleware, getMealDeliveryById);

// Update a meal delivery by ID
router.put('/meal-delivery/:id',authMiddleware, updateMealDelivery);

// Delete a meal delivery by ID
router.delete('/meal-delivery/:id',authMiddleware, deleteMealDelivery);

export default router;
