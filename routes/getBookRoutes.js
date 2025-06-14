import express from "express";
import { db } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();
// console.log("cloudinary object inside route:", cloudinary);

router.get("/books", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM books");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    res
      .status(200)
      .json({ message: "Books fetched successfully", books: rows });
  } catch (error) {
    console.error("Error fetching books: ", error);
    res.status(500).json({ message: "Error fetching books" });
  }
});

export default router;
