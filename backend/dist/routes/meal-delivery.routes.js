"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meal_delivery_controller_1 = require("../controllers/meal-delivery.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Create a new meal delivery record
router.post('/meal-delivery', authMiddleware_1.authMiddleware, meal_delivery_controller_1.createMealDelivery);
// Get all meal deliveries
router.get('/meal-delivery', authMiddleware_1.authMiddleware, meal_delivery_controller_1.getMealDeliveries);
// Get a single meal delivery by ID
router.get('/meal-delivery/:id', authMiddleware_1.authMiddleware, meal_delivery_controller_1.getMealDeliveryById);
// Update a meal delivery by ID
router.put('/meal-delivery/:id', authMiddleware_1.authMiddleware, meal_delivery_controller_1.updateMealDelivery);
// Delete a meal delivery by ID
router.delete('/meal-delivery/:id', authMiddleware_1.authMiddleware, meal_delivery_controller_1.deleteMealDelivery);
exports.default = router;
