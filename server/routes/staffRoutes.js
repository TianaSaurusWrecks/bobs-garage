// staffRoutes.js
// API routes for managing staff profiles

const express = require("express");
const router = express.Router();

const staffModel = require("../models/staffModel");
const { staffSchema } = require("../validation/staffValidation");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

// GET - retrieve all staff members
router.get("/", async (req, res) => {
    try {
        const staff = await staffModel.getAllStaff();

        res.json(staff);
    } catch (error) {
        console.error("Error retrieving staff:", error);

        res.status(500).json({
            message: "Unable to retrieve staff."
        });
    }
});

// GET - retrieve a staff member by ID
router.get("/:id", async (req, res) => {
    try {
        const staffMember = await staffModel.getStaffById(req.params.id);

        if (!staffMember) {
            return res.status(404).json({
                message: "Staff member not found"
            });
        }

        res.json(staffMember);
    } catch (error) {
        console.error("Error retrieving staff member:", error);

        res.status(500).json({
            message: "Unable to retrieve staff member"
        });
    }
});

// POST - create a new staff member
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        
        // Validate the request body
        const { error } = staffSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        
        // Extract the validated values
        const { name, job_title, bio, image_url } = req.body;
        // Create the staff member
        const staffId = await staffModel.createStaff(
            name,
            job_title,
            bio,
            image_url
        );

        res.status(201).json({
            message: "Staff member created successfully!",
            staffId: staffId
        });
    } catch (error) {
        console.error("Error creating staff member:", error);

        res.status(500).json({
            message: "Unable to create staff member."
        });
    }
});

// PUT - update an existing staff member
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        
        // validate the req body
        const { error } = staffSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        
        const { name, job_title, bio, image_url } = req.body;

        const result = await staffModel.updateStaff(
            req.params.id,
            name,
            job_title,
            bio,
            image_url
        );

        if (result === 0) {
            return res.status(404).json({
                message: "Staff member not found."
            });
        }

        res.json({
            message: "Staff member updated successfully!"
        });
    } catch (error) {
        console.error("Error updating staff member:", error);

        res.status(500).json({
            message: "Unable to update staff member."
        });
    }
});

// DELETE - delete a staff member
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await staffModel.deleteStaff(req.params.id);

        if (result === 0) {
            return res.status(404).json({
                message: "Staff member not found."
            });
        }

        res.json({
            message: "Staff member deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting staff member:", error);

        res.status(500).json({
            message: "Unable to delete staff member."
        });
    }
});

module.exports = router;