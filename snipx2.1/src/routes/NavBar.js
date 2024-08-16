import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import './style.css';

const NavBar = () => {
    const { user, logout } = useAuth();

    return (
        <>
            <nav>
                <ul>
                {user ? (
                        <li>
                           <Link to="/login" onClick={logout}> LOGOUT </Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/login">LOGIN</Link>
                        </li>
                    )}
                    <li>
                        <Link to="/home">CREATE SNIPPETS</Link>
                    </li>
                    <li>
                        <Link to="/snippets">ALL SNIPPETS</Link>
                    </li>
                    <li>
                        <Link to="/users">USERS</Link>
                    </li>
                </ul>
            </nav>
            <Outlet /> {/* This is where the child components will be rendered */}
        </>
    );
};

export default NavBar;