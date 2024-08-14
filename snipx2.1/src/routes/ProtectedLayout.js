import React from "react";
import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { useAuthState } from "react-firebase-hooks/auth";

export const ProtectedLayout = () => {
  // Getting auth functions and user details from Auth context using useAuth hook (local auth state)
  const { user, checkDatabase, auth } = useAuth();
  // Using useAuthState to get current Firebase auth state
  const [firebaseUser] = useAuthState(auth);

  const outlet = useOutlet();

  // If user authenticated in Firebase, but locally not, then check user on the backend to authenticate locally
  if (!user.email && firebaseUser) {
    checkDatabase(firebaseUser);
  // If user don't authenticated both locally and in Firebase, navigate to Login page
  } else if (!user.email) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    // If the user is logged in but is not an admin, redirect to a "Not Authorized" page
    return <Navigate to="/not-authorized" />;
  }
  
  // If user authenticated, then show page that user tries to access
  return <>{outlet}</>;
};
