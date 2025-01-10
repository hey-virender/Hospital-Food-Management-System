import { Request, Response } from 'express';
import MealPreparationModel from './../models/meal-preparation.model'; // Your meal preparation model
import PatientModel from './../models/patient.model'; // Your patient model

// Analytics Controller
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    // Fetch total patients
    const totalPatients = await PatientModel.countDocuments();

    // Fetch meals served today (you can adjust the date range if needed)
    const mealsServedToday = await MealPreparationModel.countDocuments({
      timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }, // From midnight today
    });

    // Fetch the meal status distribution
    const mealStatus = await MealPreparationModel.aggregate([
      {
        $group: {
          _id: "$preparationStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // Fetch meals served by time of day
    const mealsByTime = await MealPreparationModel.aggregate([
      {
        $group: {
          _id: "$mealTime", // Assuming you have a `mealTime` field (morning, afternoon, night)
          count: { $sum: 1 },
        },
      },
    ]);

    // Prepare response data
    const response = {
      totalPatients,
      mealsServedToday,
      mealStatus: {
        pending: mealStatus.find((status: any) => status._id === 'pending')?.count || 0,
        inProgress: mealStatus.find((status: any) => status._id === 'in progress')?.count || 0,
        readyForDelivery: mealStatus.find((status: any) => status._id === 'ready for delivery')?.count || 0,
        delivered: mealStatus.find((status: any) => status._id === 'delivered')?.count || 0,
      },
      mealsByTime: {
        morning: mealsByTime.find((item: any) => item._id === 'morning')?.count || 0,
        afternoon: mealsByTime.find((item: any) => item._id === 'afternoon')?.count || 0,
        night: mealsByTime.find((item: any) => item._id === 'night')?.count || 0,
      },
    };

    // Send response
    res.json(response);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
};
