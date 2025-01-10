// src/models/task.model.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface Task extends Document {
  _id: Types.ObjectId;
  taskType: 'Preparation' | 'Delivery';
  assignedTo: mongoose.Types.ObjectId; // Reference to Pantry Staff or Delivery Personnel
  mealDetails: string; // Details about the meal
  status: 'Pending' | 'In Progress' | 'Completed';
  timestamp: Date;
}

const TaskSchema: Schema = new Schema({
  taskType: { type: String, enum: ['Preparation', 'Delivery'], required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'PantryStaff' },
  mealDetails: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], required: true },
  timestamp: { type: Date, default: Date.now },
});

const TaskModel = mongoose.model<Task>('Task', TaskSchema);
export default TaskModel;
