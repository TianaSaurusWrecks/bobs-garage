// serviceRoutes.js
// API routes for managing workshop services

const express = require("express");
const router = express.Router();
const serviceModel = require("../models/serviceModel");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const { serviceSchema } = require("../validation/serviceValidation");

// GET - retrieve all services
router.get("/", async (req, res) => {
    try {
        const services = await serviceModel.getAllServices();

        res.json(services);
    } catch (error) {
        console.error("Error retrieving services:", error);

        res.status(500).json({
            message: "Unable to retrieve services."
        });
    }
});

// GET - retrieve a service by its ID
router.get("/:id", async (req, res) => {
    try {
        const service = await serviceModel.getServiceById(req.params.id);

        if (!service) {
            return res.status(404).json({
                message: "Service not found."
            });
        }
        res.json({
            message: "Service retrieved successfully!",
            service: service
        });

    } catch (error) {
        console.error("Error retrieving service:", error);

        res.status(500).json({
            message: "Unable to retrieve service."
        });
    }
});

// POST - create a new service
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        // validate the request body using joi
        const { error } = serviceSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        // extract service details from the request
        const { name, description, price, image_url } = req.body;

        // create the service in the db
        const result = await serviceModel.createService(
            name,
            description,
            price,
            image_url
        );

        res.status(201).json({
            message: "Service created successfully!",
            serviceId: result.insertId
        });
    } catch (error) {
        console.error("Error creating service:", error);

        res.status(500).json({
            message: "Unable to create service."
        });
    }
});
    
// PUT - Update an existing service
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        // validate the request body using Joi
        const { error } = serviceSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        // extract service details from the request
        const { name, description, price, image_url } = req.body;

        const result = await serviceModel.updateService(
            req.params.id,
            name,
            description,
            price,
            image_url
        );

        if (result === 0) {
            return res.status(404).json({
                message: "Service not found."
            });
        }
        res.json({
            message: "Service updated successfully!"
        });
    } catch (error) {
        console.error("Error updating service:", error);

        res.status(500).json({
            message: "Unable to update service."
        });
    }
});

// DELETE - delete a service by its id
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await serviceModel.deleteService(req.params.id);

        if (result === 0) {
            return res.status(404).json({
                message: "Service not found."
            });
        }
        res.json({
            message: "Service deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting service:", error);

        res.status(500).json({
            message: "Unable to delete service."
        });
    }
});

module.exports = router;

