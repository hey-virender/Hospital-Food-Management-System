// src/components/auth/Login.tsx
import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
// Assuming you have an API service
import {
  setLoading,
  setError,
  setErrorWithTimeout,
} from "../../store/slices/uiSlice"; // UI slice actions
import useAxios from "../../hooks/useAxios";
import { AppDispatch } from "../../store/store";

const Login: React.FC = () => {
  const axios = useAxios();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch : AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    dispatch(setLoading(true)); // Start loading from UI slice
    dispatch(setError("")); // Clear any previous errors

    try {
      const response: any = await axios.post("/login", { email, password });
     
      dispatch(login(response.data)); // Dispatch login action with the response data
      navigate("/"); // Redirect to dashboard on success
    } catch (error:any) {
    dispatch(setErrorWithTimeout(error.response.data.message))
    } finally {
      dispatch(setLoading(false)); // Stop loading from UI slice
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ marginTop: "16px" }}
        >
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
