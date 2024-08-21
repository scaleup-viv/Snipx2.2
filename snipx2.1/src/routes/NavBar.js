import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuth } from "../AuthProvider";
import { Link, Outlet } from 'react-router-dom';
import { FaHome, FaPlusSquare, FaClipboardList, FaUsers, FaSignOutAlt, FaChartBar, FaRegCircle, FaCircle, FaCalendarPlus, FaAngleDoubleLeft , FaAngleDoubleRight, FaSignInAlt } from 'react-icons/fa'; // Import icons
import './style.css';

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import GoogleIcon from "@mui/icons-material/Google";
import Button from "@mui/material/Button";

const NavBar = () => {
    const { user, logout, login, auth, checkDatabase} = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle state
    const [firebaseUser, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.email) {
        return navigate("/home");
        } else if (!loading && firebaseUser) {
        checkDatabase(firebaseUser);
        }
    }, [user, loading, firebaseUser, navigate, checkDatabase]);

    const handleSubmit = (event) => {
        event.preventDefault();
        login();
    };

    const toggleColors = () => {
        if (isDarkMode) {
            document.documentElement.style.setProperty('--navbar-color', 'rgb(30, 30, 30)');
            document.documentElement.style.setProperty('--btn-bg-color', '#00bd9b');
            document.documentElement.style.setProperty('--btn-bg-color2', 'rgb(0, 213, 255)');
            document.documentElement.style.setProperty('--graph-line-color', 'rgb(0, 213, 255)');
            document.documentElement.style.setProperty('--bg-color', 'rgb(40, 40, 40)');
            document.documentElement.style.setProperty('--container-color1', 'rgb(100, 100, 100)');
            document.documentElement.style.setProperty('--container-color2', 'rgb(100, 100, 100)');
            document.documentElement.style.setProperty('--black-text', 'white');
        } else {
            document.documentElement.style.setProperty('--navbar-color', '#FFB300');
            document.documentElement.style.setProperty('--btn-bg-color', '#E4277D');
            document.documentElement.style.setProperty('--btn-bg-color2', '#FFB300');
            document.documentElement.style.setProperty('--graph-line-color', '#FFB300');
            document.documentElement.style.setProperty('--bg-color', '#ebedee');
            document.documentElement.style.setProperty('--container-color1', '#E4277D');
            document.documentElement.style.setProperty('--container-color2', '#FFB300');
            document.documentElement.style.setProperty('--black-text', 'black');
        }
        setIsDarkMode(!isDarkMode);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <nav className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="logo">
                    <h2>SNIP<span>X</span></h2>
                    <p>by ScaleUp</p>
                </div>
                <ul>
                    {user ? (
                        <>
                            <li>
                                <Link to="/home"><FaHome /> Home</Link>
                            </li>
                            <li>
                                <Link to="/add-snippet"><FaPlusSquare /> Create Snippets</Link>
                            </li>
                            <li>
                                <Link to="/weekly-report"><FaCalendarPlus /> Weekly Report</Link>
                            </li>
                            <li>
                                <Link to="/my-snippets"><FaClipboardList /> My Snippets</Link>
                            </li>

                            {user.role === 'admin' && (
                                <>
                                    <li>
                                        <Link to="/snippets"><FaChartBar /> All Snippets</Link>
                                    </li>
                                    <li>
                                        <Link to="/users"><FaUsers /> Users</Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <Link to="#" onClick={(e) => {
                                    e.preventDefault();
                                    toggleColors();
                                }}>
                                    {isDarkMode ? <><FaRegCircle /> Switch Dark Mode</> : <><FaCircle /> Switch Scaleup Mode</>}
                                </Link>
                            </li>
                            <li className="logout">
                                <Link to="/login" onClick={logout}><FaSignOutAlt /> Log Out</Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/login" onClick={handleSubmit}><FaSignInAlt />Login</Link>
                        </li>
                    )}
                </ul>
            </nav>
            <div className="toggle-btn" onClick={toggleSidebar}>
                {isSidebarOpen ? <FaAngleDoubleLeft  /> : <FaAngleDoubleRight />}
            </div>
            <div className={`content ${isSidebarOpen ? '' : 'shifted'}`}>
                <Outlet />
            </div>
        </>
    );
};

export default NavBar;
