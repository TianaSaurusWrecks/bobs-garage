import { createContext, useContext, useState, useEffect } from 'react';
import API_URL from "../config/api";

// create the authentication context
const AuthContext = createContext();


// Provide authentication information to the app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [darkMode, setDarkMode] = useState(false);

    // load the user's saved theme preference
    useEffect(() => {
        async function loadPreferences() {
            if (!user?.id) {
                setDarkMode(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/api/preferences/${user.id}`,
                    {
                        method: 'GET',
                        credentials: 'include'
                    }
                );

                if (!response.ok) {
                    if (response.status === 404) {
                        // no preferences saved yet so use light mode
                        setDarkMode(false);
                        return;
                    }

                    throw new Error('Unable to load preferences.');
                }

                const preferences = await response.json();

                setDarkMode(Boolean(preferences.dark_mode));
            } catch (error) {
                console.error('Error loading preferences:', error);
            }
        }

        loadPreferences();
    }, [user]);

    // store the logged-in user's details
    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    // log out the user
    const logout = async () => {
        try {
            await fetch(`${API_URL}/api/users/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("user");
            setUser(null);
            setDarkMode(false);
        }
    };

    // toggle dark mode and save the preference
    const toggleDarkMode = async () => {
        const nextDarkMode = !darkMode;

        // update the theme immediately
        setDarkMode(nextDarkMode);

        // only save to the database if the user is logged in
        if (!user?.id) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/preferences/${user.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        dark_mode: nextDarkMode
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Unable to save theme preference.');
            }
        } catch (error) {
            console.error('Error saving theme preference:', error);

            
        }
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, darkMode, toggleDarkMode }}>
            {children}
        </AuthContext.Provider>
    );
};

// Access authentication information from components
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
