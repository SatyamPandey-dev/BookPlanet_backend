import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("cloudinary configured successfully");
} catch (error) {
  console.error("Error setting up Cloudinary: ", error);
}

export default cloudinary;
