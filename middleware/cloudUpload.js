import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bookland",
    upload_preset: "bookland_preset",

    allowed_formats: ["jpg", "png", "pdf", "epub"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const parser = multer({ storage });
export default parser;
