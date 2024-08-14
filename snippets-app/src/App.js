import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Snippets from './Snippets';
import Users from './Users';
import Auth from './Auth';
import NavBar from './NavBar';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <div className="App">
                <NavBar />
                <Routes>
                    <Route path="/" element={<Snippets />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/auth" element={<Auth isLoggedIn={isLoggedIn} onLogin={handleLogin} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
