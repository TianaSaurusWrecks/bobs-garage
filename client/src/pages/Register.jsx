import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {

    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
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

        setMessage('Creating your account...');

        try {
            const response = await fetch(
                'http://localhost:5000/api/users/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || 'Unable to register.');
                return;
            }

            // setMessage('Registration successful! You can now log in.');
            login(data.user);
            setMessage('Registration successful!');
            navigate('/services')


        } catch (error) {
            console.error('Registration error:', error);
            setMessage('Unable to connect to the server.');
        }
    }

    return (
        <main className="login-page">
            <div className="login-heading">
                <h1>Create an Account</h1>
                <p>Join the Bob's Garage community.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Full Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    minLength="2"
                    maxLength="100"
                    required
                />

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
                    minLength="8"
                    maxLength="128"
                    required
                />

                <p className="password-hint">
                    Password must be at least 8 characters and include an uppercase letter, lowercase letter, number and special character.
                </p>

                <button type="submit" className="login-button">
                    Register
                </button>

                {message && <p className="login-message">{message}</p>}

                <p className="register-link">
                    Already have an account? <Link to="/login">Log in here</Link>
                </p>
            </form>
        </main>
    );
}

export default Register;