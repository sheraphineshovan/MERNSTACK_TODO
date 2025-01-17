//Login
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernameOrEmail, password }),
        });

        if (response.ok) {
            const { userId } = await response.json();
            localStorage.setItem('userId', userId);
            navigate('/todo');
        } else {
            const error = await response.json();
            setMessage(error.message || 'Login failed');
        }
    };

    return (
        <div className="container bg-dark text-light p-4 rounded">
            <h2 className="text-center mb-4">Login</h2>
            {message && <p className="text-danger">{message}</p>}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Username or Email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
            <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
