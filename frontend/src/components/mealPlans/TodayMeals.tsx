import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
  Grid,
} from "@mui/material";
import useAxios from "../../hooks/useAxios";
import { useDispatch, useSelector } from "react-redux"; // Assuming you are using Redux
import { setErrorWithTimeout, setMessageWithTimeout } from "../../store/slices/uiSlice";
import { AppDispatch } from "../../store/store";

const TodayMeals: React.FC = () => {
  const dispatch:AppDispatch = useDispatch()
  const axios = useAxios();
  const role = useSelector((state: any) => state.auth.user.role); // Example: Assuming role is stored in Redux state
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("/meal-preparation");
        
        setMeals(response.data);
      } catch (error :any) {
        dispatch(setErrorWithTimeout(error.response.data.message))
        console.error("Error fetching today meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleStatusChange = async (mealId: string, status: string) => {
    try {
      const updateData = { preparationStatus: status };
      await axios.put(`/meal-preparation/${mealId}`, updateData);
      dispatch(setMessageWithTimeout("Status updated successfully"))
      setMeals(
        meals.map((meal) =>
          meal._id === mealId ? { ...meal, preparationStatus: status } : meal,
        ),
      );
    } catch (error : any) {
      dispatch(setErrorWithTimeout(error.response.data.message))
      console.error("Error updating meal status:", error);
    }
  };

  const handleDelete = async (mealId: string) => {
    try {
      await axios.delete(`/meal-preparation/${mealId}`);
      setMeals(meals.filter((meal) => meal._id !== mealId));
    } catch (error:any) {
      dispatch(setErrorWithTimeout(error.response.data.message))
      console.error("Error deleting meal:", error);
    }
  };

  const getStatusButtons = (mealId: string, currentStatus: string) => {
    const statusOptions: any = {
      Admin: ["pending", "progress", "ready for delivery", "delivered"],
      PantryStaff: ["progress", "ready for delivery"],
      DeliveryPersonnel: [],
    };

    const allowedStatuses = statusOptions[role];

    return allowedStatuses.map((status: any) => (
      <Button
        key={status}
        variant="contained"
        color={
          status === "progress"
            ? "primary"
            : status === "ready for delivery"
            ? "secondary"
            : status == "delivered"
            ? "success"
            : "inherit"
        }
        onClick={() => handleStatusChange(mealId, status)}
        disabled={currentStatus === status}
        className="text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        {status.replace(/-/g, " ")}
      </Button>
    ));
  };

  return (
    <div className="w-full mx-auto mt-8">
      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <Box>
          {meals.map((meal) => (
            <Card className="shadow-xl rounded-lg">
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  className="font-semibold text-lg text-gray-800"
                >
                  Ingredients:
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="text-gray-600"
                >
                  {meal.mealPlan.ingredients.join(", ")}
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  className="font-semibold text-lg text-gray-800 mt-3"
                >
                  Instructions:
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="text-gray-600"
                >
                  {meal.mealPlan.instructions}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "green",
                    textTransform: "capitalize",
                  }}
                >
                  <strong>Status: </strong> {meal.preparationStatus}
                </Typography>
              </CardContent>

              {/* Buttons section */}
              <div className="flex justify-between p-4 bg-gray-50 rounded-b-lg">
                {role !== "DeliveryPersonnel" && (
                  <div className="flex gap-2">
                    {getStatusButtons(meal._id, meal.preparationStatus)}
                  </div>
                )}

                {role === "Admin" && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(meal._id)}
                    className="text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </Box>
      )}
    </div>
  );
};

export default TodayMeals;
