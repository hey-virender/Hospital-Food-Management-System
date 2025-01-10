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
exports.deleteMealDelivery = exports.updateMealDelivery = exports.getMealDeliveryById = exports.getMealDeliveries = exports.createMealDelivery = void 0;
const meal_delivery_model_1 = __importDefault(require("../models/meal-delivery.model"));
// Create a new meal delivery entry
const createMealDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mealDelivery = new meal_delivery_model_1.default(req.body);
        yield mealDelivery.save();
        return res.status(201).json(mealDelivery);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.createMealDelivery = createMealDelivery;
// Get all meal deliveries
const getMealDeliveries = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mealDeliveries = yield meal_delivery_model_1.default.find().populate('mealPlan').populate('assignedTo');
        return res.status(200).json(mealDeliveries);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getMealDeliveries = getMealDeliveries;
// Get a single meal delivery by ID
const getMealDeliveryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mealDelivery = yield meal_delivery_model_1.default.findById(req.params.id).populate('mealPlan').populate('assignedTo');
        if (!mealDelivery) {
            return res.status(404).json({ message: 'Meal Delivery not found' });
        }
        return res.status(200).json(mealDelivery);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getMealDeliveryById = getMealDeliveryById;
// Update specific fields (e.g., delivery status, notes) of a meal delivery by ID
const updateMealDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allowedFieldsToUpdate = ['deliveryStatus', 'deliveryNotes']; // Allow only these fields to be updated
        const updateData = {};
        // Filter only allowed fields from the request body
        for (let field of allowedFieldsToUpdate) {
            if (req.body[field]) {
                updateData[field] = req.body[field];
            }
        }
        const mealDelivery = yield meal_delivery_model_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!mealDelivery) {
            return res.status(404).json({ message: 'Meal Delivery not found' });
        }
        return res.status(200).json(mealDelivery);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.updateMealDelivery = updateMealDelivery;
// Delete a meal delivery by ID
const deleteMealDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mealDelivery = yield meal_delivery_model_1.default.findByIdAndDelete(req.params.id);
        if (!mealDelivery) {
            return res.status(404).json({ message: 'Meal Delivery not found' });
        }
        return res.status(200).json({ message: 'Meal Delivery deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deleteMealDelivery = deleteMealDelivery;
