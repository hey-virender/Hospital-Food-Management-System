import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { setErrorWithTimeout } from "../../store/slices/uiSlice";
import { AppDispatch } from "../../store/store";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
});

const Header: React.FC = () => {
  const { role } = useSelector((state: any) => state.auth.user);
  const axios = useAxios();
  const dispatch:AppDispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();

  // handleNavigate now takes the route as a string directly
  const handleNavigate = (route: string) => {
    navigate(route);
  };
  const handleLogout = async () => {
    try {
      await axios.get("/logout");
      dispatch(logout());
    } catch (error:any) {
      dispatch(setErrorWithTimeout(error.response.data.message))
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Hospital Food Management System
          </Typography>
          {/* Pass the route string directly to the handler */}
          <Button color="inherit" onClick={() => handleNavigate("/")}>
            Home
          </Button>
          {role == "Admin" && (
            <Button
              color="inherit"
              onClick={() => handleNavigate("/analytics")}
            >
              Analytics
            </Button>
          )}
          <Button color="inherit" onClick={() => handleNavigate("/profile")}>
            Profile
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
