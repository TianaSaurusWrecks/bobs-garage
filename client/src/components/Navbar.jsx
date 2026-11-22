// Navigation Bar Component

import { NavLink } from 'react-router-dom';

function Navbar() {
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
                <NavLink to="/about">About Us</NavLink>
                <NavLink to="/services">Services</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                <NavLink to="/login">Login</NavLink>
            </nav>

            <button className="theme-toggle" aria-label="Toggle dark mode">
                ☀️
            </button>
        </header>
    );
}

export default Navbar;