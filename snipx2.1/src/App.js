import Users from "./routes/Users";
import Snippets from "./routes/Snippets";
import Login from "./routes/Login";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  defer,
} from "react-router-dom";

import { AuthProvider } from "./AuthProvider";
import React, { createContext } from "react";
import Home from "./routes/Home";
import MainLayout from "./routes/MainLayout";
import { ProtectedLayout } from "./routes/ProtectedLayout";
// Creating context for the base API URL.
// export const apiUrl = createContext("http://localhost:8080"); //local api during development
export const apiUrl = createContext("https://extension-360407.lm.r.appspot.com");

// The ProtectedLayout component is used to wrap routes that require user authentication.
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="/" element={<MainLayout />}>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Snippets />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
    </Route>
  )
);