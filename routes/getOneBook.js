import express from "express";
import { db } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();
// console.log("cloudinary object inside route:", cloudinary);

router.get("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    // console.log("book : ", rows);
    res
      .status(200)
      .json({ message: "Books fetched successfully", books: rows });
  } catch (error) {
    console.error("Error fetching books: ", error);
    res.status(500).json({ message: "Error fetching books" });
  }
});

router.get("/summary/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    // console.log("book : ", rows);
    res
      .status(200)
      .json({ message: "Books fetched successfully", books: rows });
  } catch (error) {
    console.error("Error fetching books: ", error);
    res.status(500).json({ message: "Error fetching books" });
  }
});

export default router;
