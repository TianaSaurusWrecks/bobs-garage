// imageRoutes.js
// API routes for managing website image records

const multer = require("multer");
const staffModel = require("../models/staffModel");

const express = require("express");
const router = express.Router();

const { put, del } = require("@vercel/blob");
const imageModel = require("../models/imageModel");
const { imageSchema } = require("../validation/imageValidation");

const { randomUUID } = require("crypto");
const path = require("path");

const authenticateToken = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");


const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
];

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 4 * 1024 * 1024, // 4 MB
        files: 1
    },

    fileFilter: (req, file, callback) => {
        if (!allowedImageTypes.includes(file.mimetype)) {
            return callback(
                new Error("Only JPEG, PNG, WebP and GIF images are allowed.")
            );
        }

        callback(null, true);
    }
});

// Handle Multer errors
const uploadSingleImage = (req, res, next) => {
    upload.single("image")(req, res, (error) => {
        if (error) {
            if (
                error instanceof multer.MulterError &&
                error.code === "LIMIT_FILE_SIZE"
            ) {
                return res.status(413).json({
                    message: "Image must be smaller than 4 MB."
                });
            }

            return res.status(400).json({
                message: error.message
            });
        }

        next();
    });
};


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
            image_type
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
            user_id ?? null,
            image_type ?? null
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
        
        
        const { filename, image_url, alt_text, image_type } = req.body;

        const result = await imageModel.updateImage(
            req.params.id,
            filename,
            image_url,
            alt_text,
            image_type ?? null
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
        // Find the image record first
        const image = await imageModel.getImageById(req.params.id);

        if (!image) {
            return res.status(404).json({
                message: "Image not found."
            });
        }

        // Check whether a staff member is using this image URL
        const isUsedByStaff = await staffModel.isImageUsedByStaff(
            image.image_url
        );

        if (isUsedByStaff) {
            return res.status(400).json({
                message: "This image is currently being used by a staff member and cannot be deleted."
            });
        }


        // Prevent deleting images assigned to other records
        if (
            image.service_id ||
            image.staff_id ||
            image.user_id ||
            image.image_type === "home" ||
            image.image_type === "about"
        ) {
            return res.status(400).json({
                message: "This image is assigned to a website section or record and cannot be deleted."
            });
        }

        
        const imageUrl = image.image_url;

        let isVercelBlobUrl = false;

        try {
            const parsedUrl = new URL(imageUrl);

            isVercelBlobUrl =
                parsedUrl.protocol === "https:" &&
                (
                    parsedUrl.hostname === "blob.vercel-storage.com" ||
                    parsedUrl.hostname.endsWith(".blob.vercel-storage.com")
                );
        } catch (error) {
            isVercelBlobUrl = false;
        }

        if (isVercelBlobUrl) {
            // Delete the actual image from Vercel Blob
            await del(imageUrl);
        } else {
            // Placeholder or external URL: no Vercel Blob object to delete
            console.warn("Skipping Blob deletion for non-Blob URL:", imageUrl);
        }


        // Delete the image record from MySQL
        const result = await imageModel.deleteImage(req.params.id);

        if (result === 0) {
            return res.status(404).json({
                message: "Image record not found."
            });
        }

        res.json({
            message: "Image deleted successfully!"
        });

    } catch (error) {
        console.error("Error deleting image:", error);

        res.status(500).json({
            message: "Unable to delete image."
        });
    }
});


router.post(
  "/upload",
  authenticateToken,
  requireAdmin,
  uploadSingleImage,
  async (req, res) => {
    try {
      // Check that an image file was selected
      if (!req.file) {
        return res.status(400).json({
          message: "Please select an image to upload.",
        });
      }

      // Validate the image details before uploading
      const imageData = {
        filename: req.file.originalname,
        image_url: "https://placeholder.invalid/image.jpg",
        alt_text: req.body.alt_text,
        service_id: req.body.service_id || null,
        staff_id: req.body.staff_id || null,
        user_id: req.body.user_id || null,
        image_type: req.body.image_type || null,
      };

      const { error, value } = imageSchema.validate(imageData);

      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }

      // Only allow one association
      const associations = [
        value.service_id,
        value.staff_id,
        value.user_id,
      ].filter((id) => id !== null && id !== undefined);

      if (associations.length > 1) {
        return res.status(400).json({
          message: "An image can only be associated with one record.",
        });
      }

      // Create a unique filename for Blob storage
      const extension = path.extname(req.file.originalname);
      const blobPath = `images/${randomUUID()}${extension}`;

      // Upload the image to Vercel Blob
      const blob = await put(blobPath, req.file.buffer, {
        access: "public",
        contentType: req.file.mimetype,
        addRandomSuffix: true,
      });

      // Save the returned URL in MySQL
      const imageId = await imageModel.createImage(
        req.file.originalname,
        blob.url,
        value.alt_text,
        value.service_id,
        value.staff_id,
        value.user_id,
        value.image_type ?? null
      );

      return res.status(201).json({
        message: "Image uploaded successfully!",
        imageId,
        image_url: blob.url,
      });
    } catch (error) {
      console.error("Image upload error:", error);

      return res.status(500).json({
        message: "Failed to upload image.",
      });
    }
  }
);




module.exports = router;