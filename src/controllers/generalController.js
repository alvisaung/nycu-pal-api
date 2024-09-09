const multer = require("multer");
const path = require("path");
const { Image } = require("../models");
const fs = require("fs").promises;
const storage = multer.memoryStorage();
const sharp = require("sharp");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "src/uploads/"); // Make sure this folder exists
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
//   },
// });
const compressImage = async (buffer, mimetype) => {
  let sharpInstance = sharp(buffer);

  if (mimetype === "image/png") {
    sharpInstance = sharpInstance.png({ quality: 70 });
  } else if (mimetype === "image/webp") {
    sharpInstance = sharpInstance.webp({ quality: 70 });
  } else {
    sharpInstance = sharpInstance.jpeg({ quality: 70 });
  }

  const compressedImageBuffer = await sharpInstance.resize(1920, 1080, { fit: "inside", withoutEnlargement: true }).toBuffer();

  return compressedImageBuffer;
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
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
    const baseUrl = "https://api.nycu-pal.com/api";
    const file = req.file;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    const relativePath = path.join("uploads", filename).replace(/\\/g, "/");
    const fullPath = path.join(__dirname, "../", relativePath);
    const fullUrl = `${baseUrl}/${relativePath}`;
    try {
      let finalBuffer = file.buffer;

      if (file.size > 1 * 1024 * 1024) {
        // If file is larger than 2MB
        finalBuffer = await compressImage(file.buffer, file.mimetype);
      }

      await fs.writeFile(fullPath, finalBuffer);

      const image = await Image.create({
        filename: filename,
        url: fullUrl,
        mimetype: file.mimetype,
        size: finalBuffer.length,
      });

      res.status(201).json({
        message: "Image uploaded successfully",
        image: image,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ message: "Error processing image", error: error.message });
    }
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
