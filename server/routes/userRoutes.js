// userRoutes.js
// API routes for user registration and authentication

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const {
    registerSchema,
    loginSchema,
    updateProfileSchema
} = require("../validation/userValidation");

// POST - Register a new customer
router.post("/register", async (req, res) => {
    try {
        
        // joi checks the info against the schema
        const { error } = registerSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        
        const { name, email, password } = req.body;

        // check whether the email is already registered
        const existingUser = await userModel.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        // hash the password before saving it
        // 12 is the cost factor - which controls how computationally expensive the hashing process is
        const passwordHash = await bcrypt.hash(password, 12);

        // create the customer account
        const userId = await userModel.createUser(
            name,
            email,
            passwordHash
        );

        // res.status(201).json({
        //     message: "User registered successfully!",
        //     userId: userId
        // });

        // retrieve the newly created user
        const user = await userModel.findUserByEmail(email);

        // create a JWT for the new user
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // set the authentication cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,
            path: "/"
        });

        // return the user's details to the frontend
        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });



    } catch (error) {
        console.error("Error registering user:", error);

        res.status(500).json({
            message: "Unable to register user."
        });
    }
});

// POST - Log in an existing user
router.post("/login", async (req, res) => {
    try {
        
        const { error } = loginSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        
        const { email, password } = req.body;

       
        // find the user by email
        const user = await userModel.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // compare the supplied password with the stored hash
        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // create an authentication token
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Set the JWT in an HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true, // js can't read the cookie
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000, // expires after 1 hour
            path: "/"
        });

        // return the user's information
        res.json({
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }         
        });
    } catch (error) {
        console.error("Error logging in:", error);

        res.status(500).json({
            message: "Unable to log in."
        });
    }
});

// POST - Log OUT the current user
router.post("/logout", (req, res) => {
    // clear the authentication cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });

    res.json({
        message: "Logged out successfully."
    });
});




// GET - retrieve the logged-in user's profile
router.get("/profile", authenticateToken, async (req, res) => {
    try {
        // req.user.userId - the user ID comes from the verified JWT not the req body
        const user = await userModel.findUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }
        res.json({
            message: "Profile retrieved successfully!",
            user: user
        });
    } catch (error) {
        console.error("Error retrieving profile.", error);

        res.status(500).json({
            message: "Unable to retrieve profile."
        });
    }
});



// PUT - update the logged in user's profile
router.put("/profile", authenticateToken, async (req, res) => {
    try {
        const { error } = updateProfileSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const { name, email } = req.body;

        const result = await userModel.updateUser(
            req.user.userId,
            name,
            email
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }
        res.json({
            message: "Profile updated successfully!"
        });
    } catch (error) {
        console.error("Error updating profile:", error);

        // ER DUP ENTRY - MySQL error code that means Duplicate Entry
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Email address is already in use."
            });
        }
        res.status(500).json({
            message: "Unable to update profile."
        });
    }
});

// GET - retrieve all registered users (ADMIN ONLY)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await userModel.getAllUsers();

        res.json({
            message: "Users retrieved successfully!",
            users: users
        });
    } catch (error) {
        console.error("Error retrieving users:", error);

        res.status(500).json({
            message: "Unable to retrieve users."
        });
    }
});

// GET - retrieve a user by ID (ADMIN ONLY)
router.get("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const user = await userModel.findUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }
        res.json({
            message: "User retrieved successfully!",
            user: user
        });
    } catch (error) {
        console.error("Error retrieving user:", error);

        res.status(500).json({
            message: "Unable to retrieve user."
        });
    }
});

// DELETE - remove a user account (ADMIN ONLY)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await userModel.deleteUser(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }
        res.json({
            message: "User deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting user:", error);

        res.status(500).json({
            message: "Unable to delete user."
        });
    }
});


module.exports = router;