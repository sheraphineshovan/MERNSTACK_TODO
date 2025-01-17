import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Todo from './Todo';

function App() {
    return (
        <div className="bg-dark text-light min-vh-100">
        <Router>
            <Routes>
                
                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/todo" element={<Todo />} />
               
            </Routes>
        </Router>
    </div>  
    );
}

export default App;
