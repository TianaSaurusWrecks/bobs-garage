// serviceModel.js
//database operations for the services table

const db = require("../config/db");

// retrieve all services
const getAllServices = async () => {
    const [rows] = await db.query(
        "SELECT * FROM services ORDER BY id ASC"
    );
    return rows;
};

// retrieve a service by its ID
const getServiceById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM services WHERE id = ?",
        [id]
    );
    return rows[0];
};

// create a new service
const createService = async (name, description, price, imageUrl) => {
    const [result] = await db.query(
        "INSERT INTO services (name, description, price, image_url) VALUES (?, ?, ?, ?)",
        [name, description, price, imageUrl]
    );
    return result.insertId;
};

// update an existing service
const updateService = async (id, name, description, price, imageUrl) => {
    const [result] = await db.query(
        "UPDATE services SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?",
        [name, description, price, imageUrl, id]
    );
    return result.affectedRows;
};

// delete a service by its ID
const deleteService = async (id) => {
    const [result] = await db.query(
        "DELETE FROM services WHERE id = ?",
        [id]
    );
    return result.affectedRows;
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};