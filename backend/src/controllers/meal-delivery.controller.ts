// src/controllers/meal-delivery.controller.ts
import { Request, Response } from 'express';
import MealDeliveryModel from '../models/meal-delivery.model';

// Create a new meal delivery entry
export const createMealDelivery = async (req: Request, res: Response): Promise<any> => {
  try {
    const mealDelivery = new MealDeliveryModel(req.body);
    await mealDelivery.save();
    return res.status(201).json(mealDelivery);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Get all meal deliveries
export const getMealDeliveries = async (_req: Request, res: Response): Promise<any> => {
  try {
    const mealDeliveries = await MealDeliveryModel.find().populate('mealPlan').populate('assignedTo');
    return res.status(200).json(mealDeliveries);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a single meal delivery by ID
export const getMealDeliveryById = async (req: Request, res: Response): Promise<any> => {
  try {
    const mealDelivery = await MealDeliveryModel.findById(req.params.id).populate('mealPlan').populate('assignedTo');
    if (!mealDelivery) {
      return res.status(404).json({ message: 'Meal Delivery not found' });
    }
    return res.status(200).json(mealDelivery);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Update specific fields (e.g., delivery status, notes) of a meal delivery by ID
export const updateMealDelivery = async (req: Request, res: Response): Promise<any> => {
  try { 
    const allowedFieldsToUpdate = ['deliveryStatus', 'deliveryNotes']; // Allow only these fields to be updated
    const updateData: { [key: string]: any } = {};

    // Filter only allowed fields from the request body
    for (let field of allowedFieldsToUpdate) {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    }

    const mealDelivery = await MealDeliveryModel.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!mealDelivery) {
      return res.status(404).json({ message: 'Meal Delivery not found' });
    }
    return res.status(200).json(mealDelivery);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Delete a meal delivery by ID
export const deleteMealDelivery = async (req: Request, res: Response): Promise<any> => {
  try {
    const mealDelivery = await MealDeliveryModel.findByIdAndDelete(req.params.id);
    if (!mealDelivery) {
      return res.status(404).json({ message: 'Meal Delivery not found' });
    }
    return res.status(200).json({ message: 'Meal Delivery deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
