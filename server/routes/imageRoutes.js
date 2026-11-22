// imageRoutes.js
// API routes for managing website image records

const express = require("express");
const router = express.Router();

const imageModel = require("../models/imageModel");
const { imageSchema } = require("../validation/imageValidation");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

// GET - Retrieve all images
router.get("/", async (req, res) => {
    try {
        const images = await imageModel.getAllImages();

        res.json(images);
    } catch (error) {
        console.error("Error retrieving images:", error);

        res.status(500).json({
            message: "Unable to retrieve images."
        });
    }
});

// GET - Retrieve an image by ID
router.get("/:id", async (req, res) => {
    try {
        const image = await imageModel.getImageById(req.params.id);

        if (!image) {
            return res.status(404).json({
                message: "Image not found."
            });
        }
        res.json(image);

    } catch (error) {
        console.error("Error retrieving image:", error);

        res.status(500).json({
            message: "Unable to retrieve image."
        });
    }
});

// POST - Create a new image record
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        console.error("Error updating image record:", error);

        // validate the request body
        const { error } = imageSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const {
            filename,
            image_url,
            alt_text,
            service_id,
            staff_id,
            user_id,
        } = req.body;

        // only one association is allowed per image
        const associations = [service_id, staff_id, user_id]
        .filter(id => id !==null && id !== undefined);

        if (associations.length > 1) {
            return res.status(400).json({
                message: "An image can only be associated with one record."
            });
        }

        const imageId = await imageModel.createImage(
            filename,
            image_url,
            alt_text,
            service_id ?? null,
            staff_id ?? null,
            user_id ?? null
        );

        res.status(201).json({
            message: "Image record created successfully!",
            imageId: imageId
        });

    } catch (error) {
        console.error("Error creating image record:", error);

        res.status(500).json({
            message: "Unable to create image record."
        });
    }
});

// PUT - update an existing image record
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        // validate
        const { error } = imageSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        
        
        const { filename, image_url, alt_text } = req.body;

        const result = await imageModel.updateImage(
            req.params.id,
            filename,
            image_url,
            alt_text
        );

        if (result === 0) {
            return res.status(404).json({
                message: "Image not found."
            });
        }

        res.json({
            message: "Image record updated successfully!"
        });
    } catch (error) {
        console.error("Error updating image record:", error);

        res.status(500).json({
            message: "Unable to update image record."
        });
    }
});

// DELETE = delete an image record
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await imageModel.deleteImage(req.params.id);

        if (result === 0) {
            return res.status(404).json({
                message: "Image not found."
            });
        }
        res.json({
            message: "Image record deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting image record:", error);

        res.status(500).json({
            message: "Unable to delete image record."
        });
    }
});

module.exports = router;