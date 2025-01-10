import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";
import useAxios from "../../hooks/useAxios";
import Header from "../common/Header";

const Profile: React.FC = () => {
  const axios = useAxios();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateData, setUpdateData] = useState({
    username: "",
    contact: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false); // Toggle Edit Mode

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/me");
        setUser(response.data);
        setUpdateData({
          username: response.data.username,
          contact: response.data.contactInfo,
          password: "",
        });
        setLoading(false);
      } catch (err) {
        setError("Error fetching profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for password
    if (updateData.password && updateData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.put("/update", updateData);
      setSuccess("Profile updated successfully");
      setError("");
      setUser(response.data); // Update the user state with the latest data
      setIsEditMode(false); // Exit edit mode after successful update
    } catch (err) {
      setError("Error updating profile");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box
        p={4}
        display="flex"
        alignItems="flex-start"
        flexDirection="column"
        sx={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <Paper
          elevation={3}
          sx={{ width: "100%", padding: 4, borderRadius: 2 }}
        >
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Profile
          </Typography>

          {error && (
            <Typography color="error" align="center" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success" align="center" sx={{ marginBottom: 2 }}>
              {success}
            </Typography>
          )}

          {/* Display Profile Details or Edit Form */}
          {isEditMode ? (
            <form onSubmit={handleUpdate}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Username"
                    name="username"
                    variant="outlined"
                    fullWidth
                    value={updateData.username}
                    onChange={handleInputChange}
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact"
                    name="contact"
                    variant="outlined"
                    fullWidth
                    value={updateData.contact}
                    onChange={handleInputChange}
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={updateData.password}
                    onChange={handleInputChange}
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
              </Grid>

              <Box
                mt={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 3, paddingX: 4 }}
                >
                  Update Profile
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setIsEditMode(false)}
                  sx={{ borderRadius: 3, paddingX: 4 }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          ) : (
            <Box textAlign="center">
              <Typography variant="h6">Username: {user.username}</Typography>
              <Typography variant="h6">Contact: {user.contactInfo}</Typography>
              <Typography variant="h6">Email: {user.email}</Typography>
              <Typography variant="h6">Role: {user.role}</Typography>
              <Typography variant="h6">
                Created At: {new Date(user.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="h6">
                Updated At: {new Date(user.updatedAt).toLocaleString()}
              </Typography>

              <Box mt={2} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditMode(true)}
                  sx={{
                    borderRadius: 3,
                    paddingX: 4,
                    backgroundColor: "#FF9F00",
                    "&:hover": {
                      backgroundColor: "#FF6F00",
                    },
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default Profile;
