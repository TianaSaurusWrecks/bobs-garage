// staffModel.js
// database operations for the staff table

const db = require("../config/db");

// retrieve all staff members
const getAllStaff = async () => {
    const [rows] = await db.query(
        "SELECT * FROM staff ORDER BY id ASC"
    );
    return rows;
};

// get staff member by id
const getStaffById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM staff WHERE id = ?",
        [id]
    );
    return rows[0];
};

// create a new staff member
const createStaff = async (name, jobTitle, bio, imageUrl) => {
    const [result] = await db.query(
        "INSERT INTO staff (name, job_title, bio, image_url) VALUES (?, ?, ?, ?)",
        [name, jobTitle, bio, imageUrl]
    );
    return result.insertId;
};

// update an existing staff member
const updateStaff = async (id, name, jobTitle, bio, imageUrl) => {
    const [result] = await db.query(
        "UPDATE staff SET name = ?, job_title = ?, bio = ?, image_url = ? WHERE id = ?",
        [name, jobTitle, bio, imageUrl, id]
    );
    return result.affectedRows;
};

// delete a staff member by id
const deleteStaff = async (id) => {
    const [result] = await db.query(
        "DELETE FROM staff WHERE id = ?",
        [id]
    );
    return result.affectedRows;
};

// Check whether a staff member is using an image URL
const isImageUsedByStaff = async (imageUrl) => {
    const [rows] = await db.query(
        "SELECT id FROM staff WHERE image_url = ? LIMIT 1",
        [imageUrl]
    );

    return rows.length > 0;
};

module.exports = {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    isImageUsedByStaff
};