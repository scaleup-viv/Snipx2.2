import React from 'react';
import './style.css';
import './Auth.css';

const Auth = ({ isLoggedIn, onLogin }) => {
    return (
        <div className="auth-container">
            {isLoggedIn ? (
                <h2>You are logged in!</h2>
            ) : (
                <button onClick={onLogin}>Continue with Google</button>
            )}
        </div>
    );
};

export default Auth;
