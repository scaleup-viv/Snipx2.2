import React, { useState, createContext } from 'react';
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    defer,
  } from "react-router-dom";
import AddSnippet from './routes/AddSnippet';
import Users from './routes/Users';
import Login from './routes/Login';
import NavBar from './routes/NavBar';
import Snippets from './routes/Snippets';
import NotAuthorized from './routes/NotAuthorized';
import Home from "./routes/Home"
import MySnippets from "./routes/MySnippets"
import { ProtectedLayout } from './routes/ProtectedLayout';
import { AuthProvider } from "./AuthProvider";
import WeeklyReports from './routes/WeeklyReports';

// export const apiUrl = createContext("http://localhost:8080"); //local api during development
export const apiUrl = createContext("https://extension-360407.lm.r.appspot.com");

// The ProtectedLayout component is used to wrap routes that require user authentication.
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="/" element={<NavBar />}>
        <Route path="login" element={<Login />} />
        <Route path="not-authorized" element={<NotAuthorized />} />
        <Route index element={<Home />} />
        <Route element={<ProtectedLayout />}>
          <Route path="snippets" element={<Snippets />} />
          <Route path="mysnippets" element={<MySnippets />} />
          <Route path="weekly-reports" element={<WeeklyReports/>}/>
          <Route path="users" element={<Users />} />
          <Route path="home" element={<AddSnippet />} />
        </Route>
      </Route>
    </Route>
  )
);