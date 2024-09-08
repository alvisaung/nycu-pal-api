const multer = require("multer");
const path = require("path");
const { Image } = require("../models");
const fs = require("fs").promises;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
  },
});

const generalController = {
  async uploadImg(req, res) {
    if (!req.file) {
      return res.status(400).send("No files uploaded.");
    }
    const uploadedImages = [];
    const baseUrl = "https://api.nycu-pal.com/api";
    const file = req.file;
    const relativePath = path.join("uploads", file.filename).replace(/\\/g, "/");
    const fullUrl = `${baseUrl}/${relativePath}`;

    const image = await Image.create({
      filename: file.filename,
      url: fullUrl,
      mimetype: file.mimetype,
      size: file.size,
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      image: image,
    });
  },

  async deleteImg(req, res) {
    try {
      const { filename } = req.body;

      if (!filename) {
        return res.status(400).json({ error: "Image name is required" });
      }

      // Find the image in the database
      const image = await Image.findOne({ where: { filename: filename } });

      if (!image) {
        return res.status(404).json({ error: "Image not found in database" });
      }

      // Delete the file from the filesystem
      const imgName = image.filename;
      const uploadsPath = path.join(__dirname, "..", "uploads");

      const fullPath = path.join(uploadsPath, filename);
      await fs.unlink(fullPath);

      // Delete the database record
      await image.destroy();

      res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "An error occurred while deleting the image" });
    }
  },
};
module.exports = { generalController, upload, storage };
