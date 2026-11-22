// preferenceModel.js
// database operations for the user_preferences table

const db = require("../config/db");

// retrieve preferences for a user
const getUserPreferences = async (userId) => {
    const [rows] = await db.query(
        "SELECT * FROM user_preferences WHERE user_id = ?",
        [userId]
    );
    return rows[0];
};

// create or update user preferences
const saveUserPreferences = async (userId, darkMode) => {
    const [existing] = await db.query(
        "SELECT id FROM user_preferences WHERE user_id = ?",
        [userId]
    );

    if (existing.length > 0) {
        // update existing preferences
        const [result] = await db.query(
            "UPDATE user_preferences SET dark_mode = ? WHERE user_id = ?",
            [darkMode, userId]
        );

        return result;
    } else {
        // create new preferences
        const [result] = await db.query(
            "INSERT INTO user_preferences (user_id, dark_mode) VALUES (?, ?)",
            [userId, darkMode]
        );
        return result;
    }
        
};

module.exports = {
    getUserPreferences,
    saveUserPreferences
};