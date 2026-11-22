 const express = require("express");
 const router = express.Router();

 const favouriteModel = require("../models/favouriteModel");
 const authenticateToken = require("../middleware/authMiddleware");

 // GET - retrieve the logged in user's favourites
 router.get("/", authenticateToken, async (req, res) => {
    try {
        const favourites = await favouriteModel.getUserFavourites(
            req.user.userId
        );
        res.json({
            message: "Favourites retrieved successfully!",
            favourites: favourites
        });
    } catch (error) {
        console.error("Error retrieving favourites:", error);

        res.status(500).json({
            message: "Unable to retrieve favourites."
        });
    }
 });

 // POST - add a service to the logged in user's favourites
 router.post("/", authenticateToken, async (req, res) => {
    
    try {
        const { service_id } = req.body;

        if (!service_id || !Number.isInteger(Number(service_id)) || Number(service_id) <= 0)
            return res.status(400).json({
                message: "A valid service ID is required."
        });
    

        const result = await favouriteModel.addFavourite(
            req.user.userId,
            Number(service_id)
        );

        res.status(201).json({
            message: "Service added to favourites!",
            favouriteId: result.insertId
        });

    } catch (error) {
        console.error("Error adding favourite:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "This service is already in your favourites."
            });
        }

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(404).json({
                message: "Service not found."
            });
        }

        res.status(500).json({
            message: "Unable to add favourite."
        });
    }
 });

 // DELETE - remove a service from the logged in user's favourites
 router.delete("/:serviceId", authenticateToken, async (req, res) => {
    try {
        const serviceId = Number(req.params.serviceId);

        if (!Number.isInteger(serviceId) || serviceId <= 0) {
            return res.status(400).json({
                message: "A valid service ID is required."
            });
        }
        const result = await favouriteModel.removeFavourite(
            req.user.userId,
            serviceId
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Favourite not found."
            });
        }
        res.json({
            message: "Favourite removed successfully!"
        });
    } catch (error) {
        console.error("Error removing favourite:", error);

        res.status(500).json({
            message: "Unable to remove favourite."
        });
    }
 });

 module.exports = router;