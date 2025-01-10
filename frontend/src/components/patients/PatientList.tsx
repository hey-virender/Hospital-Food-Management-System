import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPatients } from "../../store/slices/patientsSlice";
import { AppDispatch } from "../../store/store";
import { setErrorWithTimeout } from "../../store/slices/uiSlice";

const PatientList: React.FC = () => {
  const dispatch:AppDispatch = useDispatch();
  const axios = useAxios();
  const { patients } = useSelector((state: any) => state.patients);
  const [searchQuery, setSearchQuery] = useState("");
  

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("/patients");
        dispatch(setPatients(response.data));
      } catch (error:any) {
        dispatch(setErrorWithTimeout(error.response.data.message))
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, [axios]);

  const filteredPatients = patients.filter((patient: any) =>
    patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Box
      sx={{
        px: 4,
        py: 8,
        maxWidth: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ mb: 6, width: "100%" }}>
        <TextField
          label="Search Patients"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Box
        className="scrollbar-hidden"
        sx={{
          maxHeight: "100vh",
        }}
      >
        <Grid container spacing={3} direction="column" alignItems="center">
          {filteredPatients.map((patient: any) => (
            <Grid item key={patient._id} sx={{ width: "100%" }}>
              <Card
                sx={{
                  border: 1,
                  borderColor: "grey.200",
                  boxShadow: 3,
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      color: "text.primary",
                    }}
                  >
                    {patient.patientName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, color: "text.secondary" }}
                  >
                    <strong>Diseases: </strong>
                    {patient.diseases.join(", ")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Allergies: </strong>
                    {patient.allergies.join(", ")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Room No: </strong>
                    {patient.roomNumber}, <strong>Bed No: </strong>
                    {patient.bedNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <strong>Age: </strong>
                    {patient.age}, <strong>Gender: </strong>
                    {patient.gender}
                  </Typography>

                  <Link
                    to={`/patient/${patient._id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 4 }}
                    >
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default PatientList;
