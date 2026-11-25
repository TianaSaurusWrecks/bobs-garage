// Navigation Bar Component
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';


function Navbar() {
    const { user, logout, darkMode, toggleDarkMode } = useAuth();

    return (
        <header className="navbar">
            <div className="navbar-brand">
                <img
                    src="/images/Logo-Bobs Garage3.png"
                    alt="Bob's Garage Logo"
                    className="logo"
                />
                <h1>Bob's Garage</h1>
            </div>

            <nav className="nav-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/services">Services</NavLink>
                <NavLink to="/contact">Contact</NavLink>

                {user?.role === 'admin' && (
                    <NavLink to="/admin">Admin Dashboard</NavLink>
                )}
                

                {user ? (
                    <button
                        className="nav-logout"
                        onClick={logout}
                    >Logout</button>
                ) : (
                    <>
                        <NavLink to="/register">Register</NavLink>
                        <NavLink to="/login">Login</NavLink>
                    </>
                )}
            </nav>

            <button 
                className={`theme-toggle ${darkMode ? 'dark-toggle' : 'light-toggle'}`}
                onClick={toggleDarkMode}
                aria-label={
                    darkMode
                        ? 'Switch to light mode'
                        : 'Switch to dark mode'
                }
                aria-pressed={darkMode}
            >
                {darkMode ? (
                    <FaSun className="theme-icon sun-icon" />
                ) : (
                    <FaMoon className="theme-icon moon-icon" />
                )}              
            </button>
        </header>
    );
}

export default Navbar;