import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from "../config/api";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage('Logging in...');

        try {
            const response = await fetch(
                `${API_URL}/api/users/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || 'Unable to log in.');
                return;
            }


           
            // update the shared authentication state
            login(data.user);
            setMessage('Login successful!');

            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/services');
            }



        } catch (error) {
            console.error('Login error:', error);
            setMessage('Unable to connect to the server.');
        }
    }

    return (
        <main className="login-page">
            <div className="login-heading">
                <h1>Welcome Back</h1>
                <p>Log in to your Bob's Garage account.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="login-button">
                    Log In
                </button>

                {message && <p className="login-message">{message}</p>}

                <p className="register-link">
                    Don't have an account? <Link to="/register">Register Here</Link>
                </p>
            </form>
        </main>
    );
}

export default Login;
