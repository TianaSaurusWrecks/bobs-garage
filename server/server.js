

const dotenv = require("dotenv");

dotenv.config();

dotenv.config({ path: ".env.local" });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const db = require("./config/db"); 
const cookieParser = require("cookie-parser");

const userModel = require("./models/userModel");
const serviceModel = require("./models/serviceModel");
const staffModel = require("./models/staffModel");
const imageModel = require("./models/imageModel");
const preferenceModel = require("./models/preferenceModel");

const authenticateToken = require("./middleware/authMiddleware");


const serviceRoutes = require("./routes/serviceRoutes");
const staffRoutes = require("./routes/staffRoutes");
const imageRoutes = require("./routes/imageRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const userRoutes = require("./routes/userRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");


const app = express();

// middleware
app.use(helmet());
app.use(cors({
    origin: [ 
        "http://localhost:5173", 
        "https://bobs-garage-client-five.vercel.app"
    ],
    credentials: true // true allows browser to send cookies with requests
}));
app.use(express.json());
app.use(cookieParser());

const requireAdmin = require("./middleware/adminMiddleware");

// API routes
app.use("/api/services", serviceRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favourites", favouriteRoutes);




// test route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Bob's Garage API"
    });
});

// database connection test
app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT DATABASE() AS databaseName");

        res.json({
            message: "Database connection successful!",
            database: rows[0].databaseName
        });
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({
            message: "Unable to connect to the database."
        });
    }
});

// test user model 
app.get("/api/test-users", async (req, res) => {
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

// test service model
app.get("/api/test-services", async (req, res) => {
    try {
        const services = await serviceModel.getAllServices();

        res.json({
            message: "Services retrieved successfully!",
            services: services
        });
    } catch (error) {
        console.error("Error retrieving services:", error);

        res.status(500).json({
            message: "Unable to retrieve services."
        });
    }
});

// test staff model
app.get("/api/test-staff", async (req, res) => {
    try {
        const staff = await staffModel.getAllStaff();

        res.json({
            message: "Staff retrieved successfully!",
            staff: staff
        });
    } catch (error) {
        console.error("Error retrieving staff:", error);

        res.status(500).json({
            message: "Unable to retrieve staff."
        });
    }
});

// test image model
app.get("/api/test-images", async (req, res) => {
    try {
        const images = await imageModel.getAllImages();

        res.json({
            message: "Images retrieved successfully!",
            images: images
        });
    } catch (error) {
        console.error("Error retrieving images:", error);

        res.status(500).json({
            message: "Unable to retrieve images."
        });
    }
});

// test preference model
app.get("/api/test-preferences/:userId", async (req, res) => {
    try {
        const preferences = await preferenceModel.getUserPreferences(
            req.params.userId
        );
        res.json({
            message: "User preferences retrieved successfully!",
            preferences: preferences || null
        });
    } catch (error) {
        console.error("Error retrieving user preferences:", error);
        res.status(500).json({
            message: "Unable to retrieve user preferences."
        });
    }
});

// test route - requires a valid JWT
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You have accessed a protected route!",
        user: req.user
    });
});

// test route - requires admin access
// 1. authenticateToken - checks that the JWT is valid
// 2. requireAdmin - checks that the user's role is admin
// Admin route is only reached if both checks pass
app.get("/api/admin", authenticateToken, requireAdmin, (req, res) => {
    res.json({
        message: "Welcome to the admin area!"
    });
});

// start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Bob's Garage API running on port ${PORT}`);
});

