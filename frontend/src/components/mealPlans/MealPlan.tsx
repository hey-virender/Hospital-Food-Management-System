import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import useAxios from "../../hooks/useAxios";
import { setErrorWithTimeout, setMessageWithTimeout } from "../../store/slices/uiSlice";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";

interface MealPlanProps {
  mealPlan: {
    _id: string;
    patient: string;
    mealTime: "Morning" | "Evening" | "Night";
    ingredients: string[];
    instructions: string;
  };
  onSave: (updatedMealPlan: any) => void;
}

const MealPlan: React.FC<MealPlanProps> = ({ mealPlan, onSave }) => {
  const dispatch:AppDispatch = useDispatch()
  const axios = useAxios();
  const [isEditing, setIsEditing] = useState(false);
  const [editedMealPlan, setEditedMealPlan] = useState({
    _id: mealPlan._id,
    mealTime: mealPlan.mealTime,
    ingredients: mealPlan.ingredients,
    instructions: mealPlan.instructions,
  });
  const [addButtonLabel, setAddButtonLabel] = useState("Add to preparation");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleAddToPreparation = async () => {
    if (addButtonLabel == "Added") {
      return;
    }
    try {
      const response = await axios.post("/meal-preparation", {
        mealPlan: mealPlan._id,
      });
      if (response.status == 201) {
        dispatch(setMessageWithTimeout("Meal Plan added to preparations"))
        setAddButtonLabel("Added");
      }
    } catch (error:any) {
      dispatch(setErrorWithTimeout(error.response.data.message))
     
    }
  };

  const handleSaveClick = () => {
    const updatedPlan = {
      ...editedMealPlan,
    };
    onSave(updatedPlan);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "ingredients") {
      setEditedMealPlan((prev) => ({
        ...prev,
        [name]: value.split(", "),
      }));
    } else {
      setEditedMealPlan((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMealTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedMealPlan((prev: any) => ({
      ...prev,
      mealTime: e.target.value,
    }));
  };

  return (
    <Card>
      <CardContent>
        {isEditing ? (
          <>
            <Typography variant="body1">Meal Time</Typography>
            <RadioGroup
              name="mealTime"
              value={editedMealPlan.mealTime}
              onChange={handleMealTimeChange}
              row
            >
              <FormControlLabel
                value="morning"
                control={<Radio />}
                label="Morning"
              />
              <FormControlLabel
                value="evening"
                control={<Radio />}
                label="Evening"
              />
              <FormControlLabel
                value="night"
                control={<Radio />}
                label="Night"
              />
            </RadioGroup>
            <TextField
              label="Ingredients"
              name="ingredients"
              value={editedMealPlan.ingredients.join(", ")}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Instructions"
              name="instructions"
              value={editedMealPlan.instructions}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        ) : (
          <>
            <Typography variant="h6">Meal Time: {mealPlan.mealTime}</Typography>
            <Typography variant="body1">
              Ingredients: {mealPlan.ingredients.join(", ")}
            </Typography>
            <Typography variant="body1">
              Instructions: {mealPlan.instructions}
            </Typography>
          </>
        )}
      </CardContent>
      <CardActions>
        {isEditing ? (
          <Button onClick={handleSaveClick} color="primary" variant="contained">
            Save
          </Button>
        ) : (
          <>
            <Button
              onClick={handleEditClick}
              color="primary"
              variant="contained"
            >
              Edit
            </Button>
            <Button
              onClick={handleAddToPreparation}
              color="secondary"
              variant="contained"
            >
              {addButtonLabel}
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default MealPlan;
