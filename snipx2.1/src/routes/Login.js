import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuth } from "../AuthProvider";
import './Login.css'

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import GoogleIcon from "@mui/icons-material/Google";
import Button from "@mui/material/Button";

const Login = () => {
  // Getting auth functions and user details from Auth context using useAuth hook (AuthProvider.js)
  const { user, login, auth, checkDatabase } = useAuth();
  // Using useAuthState to get current Firebase auth state, loading status
  console.log("user")
  console.log(user)
  console.log("login")
  console.log(login)
  console.log("auth:")
  console.log(auth)
  console.log("checkDatabase:")
  console.log(checkDatabase)

  const [firebaseUser, loading] = useAuthState(auth);
  // Using useNavigate hook to get function to programmatically navigate to different routes
  const navigate = useNavigate();

  // useEffect to check for user state and navigate accordingly on user's auth state change
  useEffect(() => {
    // if user authenticated both locally and in firebase
    if (user?.email) {
      return navigate("/home");
      // if user locally not authenticated, only in firebase, then check user on backend to authenticate locally
    } else if (!loading && firebaseUser) {
      checkDatabase(firebaseUser);
    }
  }, [user, loading, firebaseUser, navigate, checkDatabase]);

  // Function to handle form submission, which initiates login process
  const handleSubmit = (event) => {
    event.preventDefault();
    login();
  };

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} autoComplete="on">
            <div className="auth-container">
              <Button
                variant="contained"
                type="submit"
                startIcon={<GoogleIcon />}
                className="login-button"
              >
                Continue with Google
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default Login;