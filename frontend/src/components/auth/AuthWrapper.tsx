// src/components/auth/AuthWrapper.tsx
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../../store/store"; // Assuming you have a RootState for Redux
import Login from "./Login"; // Import the Login component
import Signup from "./Signup"; // Import the SignUp component

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  ); // Access auth state from Redux store
  const [showLogin, setShowLogin] = useState(true); // State to toggle between Login and Sign Up

  

  const toggleAuthView = () => {
    setShowLogin(!showLogin);
  };

  // If the user is authenticated, render the children (the protected route content)
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div>
      {showLogin ? <Login /> : <Signup />}
      {/* <button onClick={toggleAuthView}>
        {showLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button> */}
    </div>
  );
};

export default AuthWrapper;
