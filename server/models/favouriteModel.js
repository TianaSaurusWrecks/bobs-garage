// favouriteModel.js

const db = require("../config/db");

// retrieve all favourite services belonging to a user
const getUserFavourites = async (userId) => {
    const [rows] = await db.query(
        `SELECT favourites.id, services.id AS service_id,
                services.name, services.description,
                services.price, services.image_url
        FROM favourites
        JOIN services ON favourites.service_id = services.id
        WHERE favourites.user_id =?`,
        [userId]
    );
    return rows;
};

// Add a service to a user's favourites
const addFavourite = async (userId, serviceId) => {
    const [result] = await db.query(
        "INSERT INTO favourites (user_id, service_id) VALUES (?, ?)",
        [userId, serviceId]
    );
    return result;
};

// remove a service from a user's favourites
const removeFavourite = async (userId, serviceId) => {
    const [result] = await db.query(
        "DELETE FROM favourites WHERE user_id = ? AND service_id = ?",
        [userId, serviceId]
    );
    return result;
};

module.exports = {
    getUserFavourites,
    addFavourite,
    removeFavourite
};