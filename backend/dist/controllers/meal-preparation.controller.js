"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMealPreparation = exports.updateMealPreparation = exports.getMealPreparationById = exports.getMealPreparations = exports.createMealPreparation = void 0;
const meal_preparation_model_1 = __importDefault(require("../models/meal-preparation.model"));
// Create a new meal preparation entry
const createMealPreparation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mealPreparation = new meal_preparation_model_1.default(req.body);
        yield mealPreparation.save();
        return res.status(201).json(mealPreparation);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.createMealPreparation = createMealPreparation;
// Get all meal preparations
const getMealPreparations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mealPreparations = yield meal_preparation_model_1.default.find()
            .populate({
            path: 'mealPlan',
            populate: {
                path: 'patient',
            },
        });
        return res.status(200).json(mealPreparations);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getMealPreparations = getMealPreparations;
// Get a single meal preparation by ID
const getMealPreparationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mealPreparation = yield meal_preparation_model_1.default.findById(req.params.id).populate('mealPlan');
        if (!mealPreparation) {
            return res.status(404).json({ message: 'Meal Preparation not found' });
        }
        return res.status(200).json(mealPreparation);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getMealPreparationById = getMealPreparationById;
// Update specific fields (e.g., preparation status, notes) of a meal preparation by ID
const updateMealPreparation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allowedFieldsToUpdate = ['preparationStatus', 'preparationNotes']; // Allow only these fields to be updated
        const updateData = {};
        // Get the current user's role (assuming it's stored in req.user or decoded JWT)
        const userRole = req.user.role; // Adjust as needed to extract role from JWT or session
        // Fetch the current meal preparation record
        const mealPreparation = yield meal_preparation_model_1.default.findById(req.params.id);
        if (!mealPreparation) {
            return res.status(404).json({ message: 'Meal Preparation not found' });
        }
        // If user is not an Admin, enforce restrictions on status updates
        if (userRole !== 'Admin' && req.body.preparationStatus) {
            const currentStatus = mealPreparation.preparationStatus;
            // Check if the status is being changed in an invalid way
            if (currentStatus === 'delivered' && req.body.preparationStatus !== currentStatus) {
                return res.status(400).json({ message: 'Cannot change the status of a delivered meal.' });
            }
            if (currentStatus === 'ready for delivery' && req.body.preparationStatus === 'progress') {
                return res.status(400).json({ message: 'Cannot change status from Ready for Delivery to In Progress.' });
            }
        }
        // Filter only allowed fields from the request body
        for (let field of allowedFieldsToUpdate) {
            if (req.body[field]) {
                updateData[field] = req.body[field];
            }
        }
        // Update the meal preparation with the allowed fields
        const updatedMealPreparation = yield meal_preparation_model_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!updatedMealPreparation) {
            return res.status(404).json({ message: 'Meal Preparation not found after update' });
        }
        return res.status(200).json(updatedMealPreparation);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.updateMealPreparation = updateMealPreparation;
// Delete a meal preparation by ID
const deleteMealPreparation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mealPreparation = yield meal_preparation_model_1.default.findByIdAndDelete(req.params.id);
        if (!mealPreparation) {
            return res.status(404).json({ message: 'Meal Preparation not found' });
        }
        return res.status(200).json({ message: 'Meal Preparation deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deleteMealPreparation = deleteMealPreparation;
