// src/components/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (usernameOrEmail && password) {
        const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usernameOrEmail,
                password,
            }),
        });

        if (response.ok) {
            setMessage('Signup successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');  
            }, 2000);  
        } else {
            const error = await response.json();
            setMessage(error.message || 'Signup failed. Please try again.');
        }
    }
  };

  return (
    <div className="container-fluid bg-dark text-light min-vh-100 ">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center text-light mb-5 mt-5">Create an Account</h2>

          {message && <div className="alert alert-info">{message}</div>}

          <div className="card p-4 bg-dark text-light border-light ">
            <form>
              <div className="mb-3">
                <label htmlFor="usernameOrEmail" className="form-label">Username or Email</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-light"
                  id="usernameOrEmail"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="Enter your username or email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control bg-dark text-light border-light"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="text-light">Already have an account? <Link to="/login" className="text-primary">Login here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
