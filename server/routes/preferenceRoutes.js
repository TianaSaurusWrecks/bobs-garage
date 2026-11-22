// preferenceRoutes.js
// API routes for managing user preferences

const express = require("express");
const router = express.Router();

const preferenceModel = require("../models/preferenceModel");
const { preferenceSchema } = require("../validation/preferenceValidation");

const authenticateToken = require("../middleware/authMiddleware");

// GET - retrieve a user's preferences
router.get("/:userId", authenticateToken, async (req, res) => {
    try {
        
        // userId they're wanting to change must match their userId
        if (String(req.user.userId) !== String(req.params.userId)) {
            return res.status(403).json ({
                message: "You can only access your own preferences."
            });
        }
        
        const preferences = await preferenceModel.getUserPreferences(
            req.params.userId
        );

        if (!preferences) {
            return res.status(404).json({
                message: "User preferences not found."
            });
        }
        res.json(preferences);
    } catch (error) {
        console.error("Error retrieving preferences", error);

        res.status(500).json({
            message: "Unable to retrieve user preferences."
        });
    }
});

// PUT - update a user's preferences
router.put("/:userId", authenticateToken, async (req, res) => {
    try {
        
        if (String(req.user.userId) !== String(req.params.userId)) {
            return res.status(403).json({
                message: "You can only access your own preferences."
            });
        }
        
        

        // validate the request body
        const { error } = preferenceSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const { dark_mode } = req.body;

        await preferenceModel.saveUserPreferences(
            req.params.userId,
            dark_mode
        );

        res.json({
            message: "User preferences saved successfully!"
        });
    } catch (error) {
        console.error("Error saving preferences:", error);

        res.status(500).json({
            message: "Unable to save user preferences."
        });
    }
});

module.exports = router;