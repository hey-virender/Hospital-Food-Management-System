import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
} from "@mui/material";
import useAxios from "../../hooks/useAxios";
import { setErrorWithTimeout, setMessageWithTimeout } from "../../store/slices/uiSlice";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";

interface AddMealPlanProps {
  patientId: string; // The ID of the patient for whom the meal plan is being created
  onMealPlanAdded: (newMealPlan: any) => void; // Callback to refresh the meal plan list
}

const AddMealPlan: React.FC<AddMealPlanProps> = ({ patientId, onMealPlanAdded }) => {
  const dispatch: AppDispatch = useDispatch();
  const axios = useAxios();

  const [mealPlan, setMealPlan] = useState({
    mealTime: "morning",
    ingredients: "",
    instructions: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMealPlan((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMealTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMealPlan((prev) => ({
      ...prev,
      mealTime: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const newMealPlan = {
        patient: patientId,
        mealTime: mealPlan.mealTime,
        ingredients: mealPlan.ingredients.split(", ").map((ing) => ing.trim()),
        instructions: mealPlan.instructions,
      };

      const response = await axios.post("/meal-plan", newMealPlan);
      if (response.status === 201) {
        dispatch(setMessageWithTimeout("Meal plan added successfully!"));
        onMealPlanAdded(response.data); // Update the parent component with the new meal plan
        setMealPlan({ mealTime: "morning", ingredients: "", instructions: "" }); // Reset form
      }
    } catch (error: any) {
      dispatch(setErrorWithTimeout(error.response?.data?.message || "Failed to add meal plan"));
      console.error("Error adding meal plan:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add Meal Plan
        </Typography>
        <RadioGroup
          name="mealTime"
          value={mealPlan.mealTime}
          onChange={handleMealTimeChange}
          row
        >
          <FormControlLabel value="morning" control={<Radio />} label="Morning" />
          <FormControlLabel value="evening" control={<Radio />} label="Evening" />
          <FormControlLabel value="night" control={<Radio />} label="Night" />
        </RadioGroup>
        <TextField
          fullWidth
          label="Ingredients (comma-separated)"
          name="ingredients"
          value={mealPlan.ingredients}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Instructions"
          name="instructions"
          value={mealPlan.instructions}
          onChange={handleChange}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Meal Plan"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddMealPlan;
