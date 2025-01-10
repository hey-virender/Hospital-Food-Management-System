import React, { useState } from "react";
import {
  Container,
  
  Box,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PatientList from "../patients/PatientList";
import TodayMeals from "../mealPlans/TodayMeals";
import Header from "../common/Header";
import PatientForm from "../patients/PatientsForm";

const Dashboard: React.FC = () => {
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);

  const handleOpenPatientForm = () => {
    setIsPatientFormOpen(true);
  };

  const handleClosePatientForm = () => {
    setIsPatientFormOpen(false);
  };

  return (
    <Container maxWidth="xl">
      <Header />
      <Box m={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenPatientForm}
        >
          Add Patient
        </Button>
      </Box>

      <Dialog
        open={isPatientFormOpen}
        onClose={handleClosePatientForm}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Add Patient
        </DialogTitle>
        <DialogContent>
          <PatientForm onClose={handleClosePatientForm} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePatientForm} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <PatientList />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TodayMeals />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
