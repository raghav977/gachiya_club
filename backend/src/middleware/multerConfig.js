import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// derive uploads directory relative to this middleware file so files end up
// in backend/uploads regardless of process.cwd()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

/**
 * Convert absolute filesystem path to relative path for database storage
 * e.g., /Users/.../backend/uploads/123-image.png -> uploads/123-image.png
 * @param {string} absolutePath - The absolute path from req.file.path
 * @returns {string|null} - Relative path starting with "uploads/" or null
 */
export const getRelativeImagePath = (absolutePath) => {
  if (!absolutePath) return null;
  const filename = path.basename(absolutePath);
  return `uploads/${filename}`;
};

/**
 * Get just the filename from a file path
 * @param {string} filePath - Any path
 * @returns {string|null} - Just the filename
 */
export const getFilename = (filePath) => {
  if (!filePath) return null;
  return path.basename(filePath);
};

export default upload;
