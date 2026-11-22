// imageModel.js
// database operations for the images table

const db = require("../config/db");

// retrieve all images
const getAllImages = async () => {
    const [rows] = await db.query(
        "SELECT * FROM images ORDER BY id ASC"
    );
    return rows;
};

// get image by id
const getImageById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM images WHERE id = ?",
        [id]
    );
    return rows[0];
};


// create new image record
const createImage = async (
    filename,
    imageUrl,
    altText,
    serviceId,
    staffId,
    userId

) => {
    const [result] = await db.query(
        `INSERT INTO images
        (filename, image_url, alt_text, service_id, staff_id, user_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [filename, imageUrl, altText, serviceId, staffId, userId]
    );
    return result.insertId;
};

// update an existing image record
const updateImage = async (
    id,
    filename,
    imageUrl,
    altText,
) => {
    const [result] = await db.query(
        `UPDATE images
        SET filename = ?, image_url = ?, alt_text = ?
        WHERE id = ?`,
        [filename, imageUrl, altText, id]
    );
    return result.affectedRows;
};

// delete an image record
const deleteImage = async (id) => {
    const [result] = await db.query(
        "DELETE FROM images WHERE id = ?",
        [id]
    );
    return result.affectedRows;
};

module.exports = {
    getAllImages,
    getImageById,
    createImage,
    updateImage,
    deleteImage
};