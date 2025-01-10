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
exports.getMealPlansByPatientId = exports.deleteMealPlan = exports.updateMealPlan = exports.getMealPlans = exports.createMealPlan = void 0;
const meal_plan_model_1 = __importDefault(require("../models/meal-plan.model"));
const patient_model_1 = __importDefault(require("../models/patient.model"));
// Create a new meal plan entry
const createMealPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { patient, mealTime, ingredients, instructions } = req.body;
        // Ensure the patient exists
        const patientExist = yield patient_model_1.default.findById(patient);
        if (!patientExist) {
            return res.status(404).json({ message: "Patient not found" });
        }
        // Create the new meal plan
        const mealPlan = new meal_plan_model_1.default({ patient, mealTime, ingredients, instructions });
        yield mealPlan.save();
        // Dynamically update the patient's mealPlans array for the corresponding mealTime
        // Push the meal plan ID into the corresponding mealTime array
        patientExist.mealPlans[mealTime].push(mealPlan._id);
        // Save the patient document with the updated mealPlans
        yield patientExist.save();
        return res.status(201).json(mealPlan);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.createMealPlan = createMealPlan;
// Get all meal plans
const getMealPlans = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mealPlans = yield meal_plan_model_1.default.find();
        return res.status(200).json(mealPlans);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getMealPlans = getMealPlans;
// Get a single meal plan by ID
// Update specific fields (e.g., meal time, ingredients, instructions) of a meal plan by ID
const updateMealPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allowedFieldsToUpdate = ['mealTime', 'ingredients', 'instructions']; // Allow only these fields to be updated
        const updateData = {};
        // Filter only allowed fields from the request body
        for (let field of allowedFieldsToUpdate) {
            if (req.body[field]) {
                updateData[field] = req.body[field];
            }
        }
        // Find the meal plan and update it
        const mealPlan = yield meal_plan_model_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal Plan not found' });
        }
        // If mealTime was updated, update the patient's mealPlans array
        if (updateData.mealTime) {
            const patient = yield patient_model_1.default.findById(mealPlan.patient);
            if (patient) {
                const oldMealTime = mealPlan.mealTime;
                const newMealTime = updateData.mealTime;
                // Safely handle oldMealTime array
                if (oldMealTime && Array.isArray(patient.mealPlans[oldMealTime])) {
                    const index = patient.mealPlans[oldMealTime].indexOf(mealPlan._id);
                    if (index > -1) {
                        patient.mealPlans[oldMealTime].splice(index, 1);
                    }
                }
                // Safely handle newMealTime array
                if (newMealTime) {
                    if (!Array.isArray(patient.mealPlans[newMealTime])) {
                        // Initialize as an empty array if undefined or not an array
                        patient.mealPlans[newMealTime] = [];
                    }
                    patient.mealPlans[newMealTime].push(mealPlan._id);
                }
                yield patient.save();
            }
        }
        return res.status(200).json(mealPlan);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
});
exports.updateMealPlan = updateMealPlan;
// Delete a meal plan by ID
const deleteMealPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mealPlan = yield meal_plan_model_1.default.findByIdAndDelete(req.params.id);
        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal Plan not found' });
        }
        // Remove the meal plan reference from the patient's mealPlans array
        const patient = yield patient_model_1.default.findById(mealPlan.patient);
        if (patient) {
            patient.mealPlans[mealPlan.mealTime].splice(patient.mealPlans[mealPlan.mealTime].indexOf(mealPlan._id), 1); // Remove the mealPlan ID from the correct mealTime array
            yield patient.save();
        }
        return res.status(200).json({ message: 'Meal Plan deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deleteMealPlan = deleteMealPlan;
// Get meal plans by patient ID
const getMealPlansByPatientId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mealPlans = yield meal_plan_model_1.default.find({ patient: req.params.id });
        if (!mealPlans.length) {
            return res.status(404).json({ message: 'No meal plans found for this patient' });
        }
        return res.status(200).json(mealPlans);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getMealPlansByPatientId = getMealPlansByPatientId;
