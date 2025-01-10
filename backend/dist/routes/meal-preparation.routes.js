"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meal_preparation_controller_1 = require("../controllers/meal-preparation.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Create a new meal preparation record
router.post('/meal-preparation', authMiddleware_1.authMiddleware, meal_preparation_controller_1.createMealPreparation);
// Get all meal preparations
router.get('/meal-preparation', authMiddleware_1.authMiddleware, meal_preparation_controller_1.getMealPreparations);
// Get a single meal preparation by ID
router.get('/meal-preparation/:id', authMiddleware_1.authMiddleware, meal_preparation_controller_1.getMealPreparationById);
// Update a meal preparation by ID
router.put('/meal-preparation/:id', authMiddleware_1.authMiddleware, meal_preparation_controller_1.updateMealPreparation);
// Delete a meal preparation by ID
router.delete('/meal-preparation/:id', authMiddleware_1.authMiddleware, meal_preparation_controller_1.deleteMealPreparation);
exports.default = router;
