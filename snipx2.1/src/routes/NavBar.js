import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import './style.css';

const NavBar = () => {
    const { user, logout } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleColors = () => {
        if (isDarkMode) {
            document.documentElement.style.setProperty('--navbar-color', 'rgb(30, 30, 30)');
            document.documentElement.style.setProperty('--btn-bg-color', '#00bd9b');
            document.documentElement.style.setProperty('--graph-line-color', 'rgb(0, 213, 255)');
            document.documentElement.style.setProperty('--bg-color', 'rgb(40, 40, 40)');
            document.documentElement.style.setProperty('--container-color1', 'rgb(100, 100, 100)');
            document.documentElement.style.setProperty('--container-color2', 'rgb(100, 100, 100)');
            document.documentElement.style.setProperty('--black-text', 'white');
          
        } else {
            document.documentElement.style.setProperty('--navbar-color', '#FFB300');
            document.documentElement.style.setProperty('--btn-bg-color', '#E4277D');
            document.documentElement.style.setProperty('--graph-line-color', '#FFB300');
            document.documentElement.style.setProperty('--bg-color', '#ebedee');
            document.documentElement.style.setProperty('--container-color1', '#E4277D');
            document.documentElement.style.setProperty('--container-color2', '#FFB300');
            document.documentElement.style.setProperty('--black-text', 'black');
        }
        setIsDarkMode(!isDarkMode);
    };

    return (
        <>
            <nav>
                <ul>
                    {user ? (
                        <>
                            <li>
                                <Link to="/login" onClick={logout}>LOGOUT</Link>
                            </li>
                            <li>
                                <Link to="/add-snippet">CREATE SNIPPETS</Link>
                            </li>
                            <li>
                                <Link to="/weekly-report">WEEKLY REPORT</Link>
                            </li>
                            <li>
                                <Link to="/my-snippets">MY SNIPPETS</Link>
                            </li>

                            {/* Conditionally render based on user role */}
                            {user.role === 'admin' && (
                                <>
                                    <li>
                                        <Link to="/snippets">ALL SNIPPETS</Link>
                                    </li>
                                    <li>
                                        <Link to="/users">USERS</Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <Link to='#' onClick={(e) => {
                                        e.preventDefault(); // Prevent the default link behavior
                                        toggleColors(); // Call your toggle function
                                    }}>
                                    {isDarkMode ? 'Switch Dark Mode' : 'Switch Scaleup Mode'}
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/login">LOGIN</Link>
                        </li>
                    )}
                </ul>
            </nav>
            <Outlet /> {/* This is where the child components will be rendered */}
        </>
    );
};

export default NavBar;
