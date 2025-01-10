// src/models/meal-plan.model.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the MealPlan interface extending mongoose Document
export interface MealPlan extends Document {
  _id: Types.ObjectId;
  patient: Types.ObjectId;  // Reference to the Patient model
  mealTime: 'morning' | 'evening' | 'night';  // Specifies the meal time
  ingredients: string[];  // List of ingredients for the meal
  instructions: string;  // Special instructions for the meal
}

// Create the MealPlan Schema
const MealPlanSchema: Schema = new Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },  // Relating meal plan to a patient
    mealTime: { type: String, enum: ['morning', 'evening', 'night'], required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
  },
  { timestamps: true }  // This will automatically add createdAt and updatedAt timestamps
);

// Create the MealPlan model
const MealPlanModel = mongoose.model<MealPlan>('MealPlan', MealPlanSchema);

export default MealPlanModel;
