// src/components/auth/Signup.tsx
import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios"; // Using custom hook for API call

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const axios = useAxios();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response: any = await axios.post("/signup", {
      name,
      email,
      password,
    });

    if (response) {
      dispatch(login(response.data)); // Assuming response contains token/user data
      navigate("/dashboard"); // Redirect to dashboard
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" align="center" gutterBottom>
        Signup
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          Signup
        </Button>
      </form>
    </Container>
  );
};

export default Signup;
