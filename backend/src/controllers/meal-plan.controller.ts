// src/controllers/meal-plan.controller.ts
import { Request, Response } from 'express';
import MealPlanModel from '../models/meal-plan.model';
import PatientModel, { Patient } from '../models/patient.model';
import { MealPlans } from "../models/patient.model";
import { Types } from 'mongoose';

// Create a new meal plan entry
export const createMealPlan = async (req: Request, res: Response): Promise<any> => {
  try {
    const { patient, mealTime, ingredients, instructions } = req.body;

    // Ensure the patient exists
    const patientExist: Patient | null = await PatientModel.findById(patient);
    if (!patientExist) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Create the new meal plan
    const mealPlan = new MealPlanModel({ patient, mealTime, ingredients, instructions });
    await mealPlan.save();

    // Dynamically update the patient's mealPlans array for the corresponding mealTime
    // Push the meal plan ID into the corresponding mealTime array
    (patientExist.mealPlans[mealTime as keyof MealPlans] as Types.ObjectId[]).push(mealPlan._id);

    // Save the patient document with the updated mealPlans
    await patientExist.save();

    return res.status(201).json(mealPlan);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Get all meal plans
export const getMealPlans = async (_req: Request, res: Response): Promise<any> => {
  try {
    const mealPlans = await MealPlanModel.find();
    return res.status(200).json(mealPlans);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a single meal plan by ID


// Update specific fields (e.g., meal time, ingredients, instructions) of a meal plan by ID
export const updateMealPlan = async (req: Request, res: Response): Promise<any> => {
  try {
    const allowedFieldsToUpdate = ['mealTime', 'ingredients', 'instructions']; // Allow only these fields to be updated
    const updateData: { [key: string]: any } = {};

    // Filter only allowed fields from the request body
    for (let field of allowedFieldsToUpdate) {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    }

    // Find the meal plan and update it
    const mealPlan = await MealPlanModel.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal Plan not found' });
    }

    // If mealTime was updated, update the patient's mealPlans array
    if (updateData.mealTime) {
      const patient = await PatientModel.findById(mealPlan.patient);
      if (patient) {
        const oldMealTime = mealPlan.mealTime as keyof typeof patient.mealPlans;
        const newMealTime = updateData.mealTime as keyof typeof patient.mealPlans;

        // Safely handle oldMealTime array
        if (oldMealTime && Array.isArray(patient.mealPlans[oldMealTime])) {
          const index = (patient.mealPlans[oldMealTime] as Types.ObjectId[]).indexOf(mealPlan._id);
          if (index > -1) {
            (patient.mealPlans[oldMealTime] as Types.ObjectId[]).splice(index, 1);
          }
        }

        // Safely handle newMealTime array
        if (newMealTime) {
          if (!Array.isArray(patient.mealPlans[newMealTime])) {
            // Initialize as an empty array if undefined or not an array
            patient.mealPlans[newMealTime] = [] as Types.ObjectId[];
          }
          (patient.mealPlans[newMealTime] as Types.ObjectId[]).push(mealPlan._id);
        }

        await patient.save();
      }
    }

    return res.status(200).json(mealPlan);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// Delete a meal plan by ID
export const deleteMealPlan = async (req: Request, res: Response): Promise<any> => {
  try {
    const mealPlan = await MealPlanModel.findByIdAndDelete(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal Plan not found' });
    }

    // Remove the meal plan reference from the patient's mealPlans array
    const patient = await PatientModel.findById(mealPlan.patient);
    if (patient) {
      (patient.mealPlans[mealPlan.mealTime as keyof MealPlans] as Types.ObjectId[]).splice((patient.mealPlans[mealPlan.mealTime as keyof MealPlans] as Types.ObjectId[]).indexOf(mealPlan._id), 1); // Remove the mealPlan ID from the correct mealTime array
      await patient.save();
    }

    return res.status(200).json({ message: 'Meal Plan deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// Get meal plans by patient ID
export const getMealPlansByPatientId = async (req: Request, res: Response): Promise<any> => {
  try {
    const mealPlans = await MealPlanModel.find({ patient: req.params.id });
    if (!mealPlans.length) {
      return res.status(404).json({ message: 'No meal plans found for this patient' });
    }
    return res.status(200).json(mealPlans);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
