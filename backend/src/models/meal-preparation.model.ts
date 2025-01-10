// src/models/meal-preparation.model.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface MealPreparation extends Document {
  _id: Types.ObjectId;
  mealPlan: Types.ObjectId; // Reference to the MealPlan model
  // Reference to the PantryStaff
  preparationStatus: 'pending' | 'progress' | 'ready for delivery' | 'delivered';
  preparationNotes: string;
  timestamp: Date;
}

const MealPreparationSchema: Schema = new Schema({
  mealPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'MealPlan', required: true },
  preparationStatus: { type: String, enum: ['pending', 'progress', 'ready for delivery','delivered'], required: true,default:'pending' },
  preparationNotes: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const MealPreparationModel = mongoose.model<MealPreparation>('MealPreparation', MealPreparationSchema);
export default MealPreparationModel;
