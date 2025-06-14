import express from "express";
import parser from "../middleware/cloudUpload.js";
import { db } from "../config/db.js";

const router = express.Router();

router.post(
  "/upload",
  (req, res, next) => {
    parser.fields([
      { name: "book", maxCount: 1 },
      { name: "cover", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { title, author, description, published_date, publisher } =
        req.body;
      const book_Url = req.files.book[0].path;
      const cover_Url = req.files.cover[0].path;

      console.log("Request received for book upload");
      // console.log("Files: ", req.files);
      // console.log("Body: ", req.body);
      // console.log("Book URL: ", book_Url);
      // console.log("Cover URL: ", cover_Url);

      const q = `INSERT INTO books (title, author, description, published_date, publisher, book_url, cover_url) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        title,
        author,
        description,
        published_date,
        publisher,
        book_Url,
        cover_Url,
      ];
      const [result] = await db.query(q, values);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Book uploaded successfully" });
      } else {
        res.status(500).json({ message: "Error uploading book" });
      }
    } catch (error) {
      console.error("Error uploading book: ", error);
      res.status(500).json({ message: "Error uploading book" });
    }
  }
);

export default router;
