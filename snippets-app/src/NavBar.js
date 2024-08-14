import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const NavBar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">CREATE SNIPPETS</Link>
                </li>
                <li>
                    <Link to="/users">USERS</Link>
                </li>
                <li>
                    <Link to="/auth">LOGIN/LOGOUT</Link>
                </li>
                <li>
                    <Link to="/snippets">ALL SNIPPETS</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
