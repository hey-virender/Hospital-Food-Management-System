"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meal_plan_controller_1 = require("../controllers/meal-plan.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Create a new meal plan
router.post('/meal-plan', authMiddleware_1.authMiddleware, meal_plan_controller_1.createMealPlan);
// Get all meal plans
router.get('/meal-plan', authMiddleware_1.authMiddleware, meal_plan_controller_1.getMealPlans);
// Get a single meal plan by patient ID
// Get a single meal plan by ID
router.get('/meal-plan/:id', authMiddleware_1.authMiddleware, meal_plan_controller_1.getMealPlansByPatientId);
// Update a meal plan by ID
router.put('/meal-plan/:id', authMiddleware_1.authMiddleware, meal_plan_controller_1.updateMealPlan);
// Delete a meal plan by ID
router.delete('/meal-plan/:id', authMiddleware_1.authMiddleware, meal_plan_controller_1.deleteMealPlan);
exports.default = router;
