// src/models/meal-delivery.model.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface MealDelivery extends Document {
  _id: Types.ObjectId;
  mealPlan: mongoose.Types.ObjectId; // Reference to the MealPlan model
  assignedTo: mongoose.Types.ObjectId; // Reference to the DeliveryPersonnel
  deliveryStatus: 'Pending' | 'Delivered' | 'In Progress';
  deliveryNotes: string;
  timestamp: Date;
}

const MealDeliverySchema: Schema = new Schema({
  mealPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'MealPlan', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPersonnel', required: true },
  deliveryStatus: { type: String, enum: ['Pending', 'Delivered', 'In Progress'], required: true },
  deliveryNotes: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const MealDeliveryModel = mongoose.model<MealDelivery>('MealDelivery', MealDeliverySchema);
export default MealDeliveryModel;
