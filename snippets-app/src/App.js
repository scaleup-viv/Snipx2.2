import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddSnippet from './AddSnippet';
import Users from './Users';
import Auth from './Auth';
import NavBar from './NavBar';
import Snippets from './Snippets';

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
                    <Route path="/" element={<AddSnippet />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/snippets" element={<Snippets />} />
                    <Route path="/auth" element={<Auth isLoggedIn={isLoggedIn} onLogin={handleLogin} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
