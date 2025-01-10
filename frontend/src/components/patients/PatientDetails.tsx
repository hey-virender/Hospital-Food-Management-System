import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import useAxios from "../../hooks/useAxios";
import MealPlan from "../mealPlans/MealPlan"; // Import the MealPlan component
import Header from "../common/Header";
import {
  setErrorWithTimeout,
  setMessageWithTimeout,
} from "../../store/slices/uiSlice";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";

const PatientDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const axios = useAxios();
  const { patientId } = useParams<{ patientId: string }>();
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const [mealPlans, setMealPlans] = useState<any>(null);
  const [editingPatient, setEditingPatient] = useState<any | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false); // Dialog state
  const [newMealPlan, setNewMealPlan] = useState({
    mealTime: "morning",
    ingredients: "",
    instructions: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const patientResponse = await axios.get(`/patients/${patientId}`);
        setPatientDetails(patientResponse.data);

        const mealPlansResponse = await axios.get(`/meal-plan/${patientId}`);
        setMealPlans(mealPlansResponse.data || null);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchDetails();
  }, [patientId]);

  const handleEditPatient = () => setEditingPatient({ ...patientDetails });

  const handleSavePatient = async () => {
    try {
      await axios.put(`/patients/${patientId}`, editingPatient);
      setPatientDetails(editingPatient);
      setEditingPatient(null);
      dispatch(setMessageWithTimeout("Patient details saved"));
    } catch (error: any) {
      dispatch(setErrorWithTimeout(error.response.data.message));
      console.error("Error saving patient details:", error);
    }
  };

  const handleAddMealPlan = async () => {
    try {
      const response = await axios.post(`/meal-plan`, {
        ...newMealPlan,
        patient: patientId,
        ingredients: newMealPlan.ingredients.split(",").map((i) => i.trim()),
      });

      if (response.status === 201) {
        dispatch(setMessageWithTimeout("Meal plan added successfully"));
        setOpenAddDialog(false);
        setNewMealPlan({
          mealTime: "morning",
          ingredients: "",
          instructions: "",
        });

        // Refresh meal plans
        const mealPlansResponse = await axios.get(`/meal-plan/${patientId}`);
        setMealPlans(mealPlansResponse.data || null);
      }
    } catch (error: any) {
      dispatch(setErrorWithTimeout(error.response.data.message));
      console.error("Error adding meal plan:", error);
    }
  };

  const handleSaveMealPlan = async (updatedMealPlan: any) => {
    try {
      const filteredMealPlan = {
        mealTime: updatedMealPlan.mealTime,
        ingredients: updatedMealPlan.ingredients,
        instructions: updatedMealPlan.instructions,
      };

      await axios.put(`/meal-plan/${updatedMealPlan._id}`, filteredMealPlan);

      const mealPlansResponse = await axios.get(`/meal-plan/${patientId}`);
      setMealPlans(mealPlansResponse.data || null);
    } catch (error: any) {
      dispatch(setErrorWithTimeout(error.response.data.message));
      console.error("Error saving meal plan:", error);
    }
  };

  return (
    <Box p={4}>
      <Header />
      {patientDetails && (
        <Card elevation={3} className="mb-4">
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Patient Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Name:</strong> {patientDetails.patientName}
                </Typography>
                <Typography>
                  <strong>Age:</strong> {patientDetails.age}
                </Typography>
                <Typography>
                  <strong>Gender:</strong> {patientDetails.gender}
                </Typography>
                <Typography>
                  <strong>Diseases:</strong>{" "}
                  {patientDetails.diseases.join(", ")}
                </Typography>
                <Typography>
                  <strong>Allergies:</strong>{" "}
                  {patientDetails.allergies.join(", ")}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Room Number:</strong> {patientDetails.roomNumber}
                </Typography>
                <Typography>
                  <strong>Bed Number:</strong> {patientDetails.bedNumber}
                </Typography>
                <Typography>
                  <strong>Floor Number:</strong> {patientDetails.floorNumber}
                </Typography>
                <Typography>
                  <strong>Contact:</strong>{" "}
                  {patientDetails.contactInformation.phone}
                </Typography>
                <Typography>
                  <strong>Email:</strong>{" "}
                  {patientDetails.contactInformation.email}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditPatient}
            >
              Edit Patient
            </Button>
          </CardActions>
        </Card>
      )}

      {editingPatient && (
        <Paper elevation={3} className="p-4">
          <Typography variant="h5" gutterBottom>
            Edit Patient Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={editingPatient.patientName}
                onChange={(e) =>
                  setEditingPatient({
                    ...editingPatient,
                    patientName: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Age"
                value={editingPatient.age}
                onChange={(e) =>
                  setEditingPatient({ ...editingPatient, age: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Gender"
                value={editingPatient.gender}
                onChange={(e) =>
                  setEditingPatient({
                    ...editingPatient,
                    gender: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Diseases (comma separated)"
                value={editingPatient.diseases.join(", ")}
                onChange={(e) =>
                  setEditingPatient({
                    ...editingPatient,
                    diseases: e.target.value.split(",").map((d) => d.trim()),
                  })
                }
              />
              <TextField
                fullWidth
                label="Allergies (comma separated)"
                value={editingPatient.allergies.join(", ")}
                onChange={(e) =>
                  setEditingPatient({
                    ...editingPatient,
                    allergies: e.target.value.split(",").map((a) => a.trim()),
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Room Number"
                value={editingPatient.roomNumber}
                onChange={(e) =>
                  setEditingPatient({
                    ...editingPatient,
                    roomNumber: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Bed Number"
                value={editingPatient.bedNumber}
                onChange={(e) =>
                  setEditingPatient({
                    ...editingPatient,
                    bedNumber: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Floor Number"
                value={editingPatient.floorNumber}
                onChange={(e) =>
                  setEditingPatient({
                    ...editingPatient,
                    floorNumber: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={editingPatient.contactInformation.phone}
                onChange={(e) =>
                  setEditingPatient({
                    ...editingPatient,
                    contactInformation: {
                      ...editingPatient.contactInformation,
                      phone: e.target.value,
                    },
                  })
                }
              />
              <TextField
                fullWidth
                label="Email Address"
                value={editingPatient.contactInformation.email}
                onChange={(e) =>
                  setEditingPatient({
                    ...editingPatient,
                    contactInformation: {
                      ...editingPatient.contactInformation,
                      email: e.target.value,
                    },
                  })
                }
              />
            </Grid>
          </Grid>
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSavePatient}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setEditingPatient(null)}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddDialog(true)}
      >
        Add Meal Plan
      </Button>

      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        fullWidth
      >
        <DialogTitle>Add Meal Plan</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Meal Time"
            value={newMealPlan.mealTime}
            onChange={(e) =>
              setNewMealPlan({ ...newMealPlan, mealTime: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Ingredients (comma separated)"
            value={newMealPlan.ingredients}
            onChange={(e) =>
              setNewMealPlan({ ...newMealPlan, ingredients: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Instructions"
            value={newMealPlan.instructions}
            onChange={(e) =>
              setNewMealPlan({ ...newMealPlan, instructions: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddMealPlan}
          >
            Add
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenAddDialog(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3} mt={4}>
        {mealPlans &&
          mealPlans.map((mealPlan: any) => (
            <Grid item xs={12} md={4} key={mealPlan._id}>
              <MealPlan mealPlan={mealPlan} onSave={handleSaveMealPlan} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default PatientDetails;
