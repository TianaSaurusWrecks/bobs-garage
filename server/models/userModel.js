// userModel.js
// Database operations for the users table

const db = require("../config/db");

// find a user by their email address
const findUserByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0];
};

// find a user by their ID
const findUserById = async (id) => {
    const [rows] = await db.query(
        "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
        [id]
    );
    return rows[0];
};

// create a new user
const createUser = async (name, email, passwordHash) => {
    const [result] = await db.query(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, passwordHash]
    );
    return result.insertId;
};

// retrieve all users 
const getAllUsers = async () => {
    const [rows] = await db.query(
        "SELECT id, name, email, role, created_at FROM users"
    );
    return rows;
};

// update a user's details
const updateUser = async (id, name, email) => {
    const [result] = await db.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, id]
    );
    return result.affectedRows;
};



// delete a user by id
const deleteUser = async (id) => {
    const connection = await db.getConnection();

    try {
        // a transaction groups several db operations together
        await connection.beginTransaction();

        // keep associated images, but remove their user association
        await connection.query(
            "UPDATE images SET user_id = NULL WHERE user_id = ?",
            [id]
        );
        // delete the user's favourites
        await connection.query(
            "DELETE FROM favourites WHERE user_id = ?",
            [id]
        );
        // delete the user's preferences
        await connection.query(
            "DELETE FROM user_preferences WHERE user_id = ?",
            [id]
        );
        // delete the user account
        const [result] = await connection.query(
            "DELETE FROM users WHERE id = ?",
            [id]
        );
        // commit the changes
        await connection.commit();

        return result;

    } catch (error) {
        // if something goes wrong cancel the changes rollback() to prevent partial deletion 
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};



// export functions 
module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    getAllUsers,
    updateUser,
    deleteUser
};