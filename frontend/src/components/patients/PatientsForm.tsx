import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import useAxios from "../../hooks/useAxios";
import { updatePatient } from "../../store/slices/patientsSlice";
import {
  setErrorWithTimeout,
  setMessageWithTimeout,
} from "../../store/slices/uiSlice";
interface PatientFormProps {
  onClose: any;
}
const PatientForm: React.FC<PatientFormProps> = ({ onClose }) => {
  const axios = useAxios();
  const dispatch: AppDispatch = useDispatch();
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [diseases, setDiseases] = useState("");
  const [allergies, setAllergies] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [bedNumber, setBedNumber] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const patientData = {
        patientName,
        age: parseInt(age, 10),
        gender,
        diseases: diseases.split(",").map((d) => d.trim()), // Convert string to array
        allergies: allergies.split(",").map((a) => a.trim()), // Convert string to array
        roomNumber: parseInt(roomNumber, 10),
        floorNumber: parseInt(floorNumber, 10),
        bedNumber: parseInt(bedNumber, 10),
        contactInformation: { phone: contactPhone, email: contactEmail },
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relationship: emergencyRelationship,
        },
      };

      const response = await axios.post("/patients", patientData);
      dispatch(updatePatient(response.data));
      dispatch(setMessageWithTimeout("Patient added successfully"));
      onClose();
    } catch (error: any) {
      console.error(error);
      dispatch(
        setErrorWithTimeout(
          error.response?.data?.message || "An error occurred",
        ),
      );
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center" gutterBottom>
        Add/Edit Patient Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Patient Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Patient Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Patient Name"
              fullWidth
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Age"
              fullWidth
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Diseases and Allergies */}
          <Grid item xs={12}>
            <TextField
              label="Diseases (comma-separated)"
              fullWidth
              value={diseases}
              onChange={(e) => setDiseases(e.target.value)}
              placeholder="e.g., Diabetes, Hypertension"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Allergies (comma-separated)"
              fullWidth
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g., Peanuts, Shellfish"
              required
            />
          </Grid>

          {/* Room Details */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Room Details
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Room Number"
              fullWidth
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Floor Number"
              fullWidth
              value={floorNumber}
              onChange={(e) => setFloorNumber(e.target.value)}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Bed Number"
              fullWidth
              value={bedNumber}
              onChange={(e) => setBedNumber(e.target.value)}
              type="number"
              required
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              fullWidth
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              fullWidth
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </Grid>

          {/* Emergency Contact */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Emergency Contact
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Name"
              fullWidth
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Phone Number"
              fullWidth
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Relationship"
              fullWidth
              value={emergencyRelationship}
              onChange={(e) => setEmergencyRelationship(e.target.value)}
              required
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box textAlign="center" mt={3}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default PatientForm;
