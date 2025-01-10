// src/controllers/meal-preparation.controller.ts
import { Request, Response } from 'express';
import MealPreparationModel from '../models/meal-preparation.model';

// Create a new meal preparation entry
export const createMealPreparation = async (req: Request, res: Response): Promise<any> => {
  try {
    const mealPreparation = new MealPreparationModel(req.body);
    await mealPreparation.save();
    return res.status(201).json(mealPreparation);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Get all meal preparations
export const getMealPreparations = async (req: Request, res: Response): Promise<any> => {
  try {
    const mealPreparations = await MealPreparationModel.find()
    .populate({
      path: 'mealPlan', 
      populate: {
        path: 'patient', 
      },
    });
  
    return res.status(200).json(mealPreparations);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a single meal preparation by ID
export const getMealPreparationById = async (req: Request, res: Response): Promise<any> => {
  try {
    const mealPreparation = await MealPreparationModel.findById(req.params.id).populate('mealPlan');
    if (!mealPreparation) {
      return res.status(404).json({ message: 'Meal Preparation not found' });
    }
    return res.status(200).json(mealPreparation);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Update specific fields (e.g., preparation status, notes) of a meal preparation by ID
export const updateMealPreparation = async (req: Request, res: Response): Promise<any> => {
  try {
    const allowedFieldsToUpdate = ['preparationStatus', 'preparationNotes']; // Allow only these fields to be updated
    const updateData: { [key: string]: any } = {};

    // Get the current user's role (assuming it's stored in req.user or decoded JWT)
    const userRole = (req as any).user.role; // Adjust as needed to extract role from JWT or session

    // Fetch the current meal preparation record
    const mealPreparation = await MealPreparationModel.findById(req.params.id);
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
    const updatedMealPreparation = await MealPreparationModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedMealPreparation) {
      return res.status(404).json({ message: 'Meal Preparation not found after update' });
    }

    return res.status(200).json(updatedMealPreparation);

  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};


// Delete a meal preparation by ID
export const deleteMealPreparation = async (req: Request, res: Response): Promise<any> => {
  try {
    const mealPreparation = await MealPreparationModel.findByIdAndDelete(req.params.id);
    if (!mealPreparation) {
      return res.status(404).json({ message: 'Meal Preparation not found' });
    }
    return res.status(200).json({ message: 'Meal Preparation deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
