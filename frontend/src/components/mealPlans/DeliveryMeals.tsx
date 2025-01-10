import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import useAxios from "../../hooks/useAxios";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import {
  setErrorWithTimeout,
  setMessageWithTimeout,
} from "../../store/slices/uiSlice";

interface Meal {
  _id: string;
  preparationStatus: string;
  mealPlan: any;
}

const DeliveryMeals: React.FC = () => {
  const axios = useAxios();
  const dispatch: AppDispatch = useDispatch();
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    // Fetch meals that are ready for delivery
    const fetchDeliveryMeals = async () => {
      try {
        const response = await axios.get("/meal-preparation");
        // Filter meals with 'ready for delivery' status
        const readyMeals = response.data.filter(
          (meal: any) => meal.preparationStatus === "ready for delivery",
        );

        setMeals(readyMeals);
      } catch (error: any) {
        dispatch(setErrorWithTimeout(error.response.data.message));
        console.error("Error fetching meals:", error);
      }
    };

    fetchDeliveryMeals();
  }, []);

  const markAsDelivered = async (mealId: string) => {
    try {
      await axios.put(`/meal-preparation/${mealId}`, {
        preparationStatus: "delivered",
      });

      setMeals(meals.filter((meal) => meal._id !== mealId));
      dispatch(setMessageWithTimeout("Status updated successfully"));
    } catch (error: any) {
      dispatch(setErrorWithTimeout(error.response.data.message));
    }
  };

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4">
        Meals Ready for Delivery
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meals.length > 0 ? (
          meals.map((meal) => (
            <Card key={meal._id} className="shadow-lg">
              <CardContent>
                <Typography variant="body2" className="mt-2">
                  <strong>Patient Name:</strong>{" "}
                  {meal.mealPlan.patient.patientName}
                </Typography>
                <Typography variant="body2">
                  <strong>Floor Number:</strong>{" "}
                  {meal.mealPlan.patient.floorNumber}
                </Typography>
                <Typography variant="body2">
                  <strong>Room Number:</strong>{" "}
                  {meal.mealPlan.patient.roomNumber}
                </Typography>
                <Typography variant="body2">
                  <strong>Bed Number:</strong> {meal.mealPlan.patient.bedNumber}
                </Typography>
                <Typography variant="body2">
                  <strong>Contact:</strong>{" "}
                  {meal.mealPlan.patient.contactInformation.number} /{" "}
                  {meal.mealPlan.patient.contactInformation.email}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  className="mt-4"
                  onClick={() => markAsDelivered(meal._id)}
                >
                  Mark as Delivered
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography
            sx={{ textAlign: "center" }}
            mt={6}
            variant="h6"
            color="textSecondary"
          >
            No meals available for delivery at the moment.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default DeliveryMeals;
