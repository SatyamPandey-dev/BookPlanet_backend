import mysql from "mysql2/promise";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/db.js";
import createTable from "./models/bookModel.js";
import { db } from "./config/db.js";
// import cloudinary from "./config/cloudinary.js";
import bookRouter from "./routes/uploadBookRoutes.js";
import getBookRouter from "./routes/getBookRoutes.js";
import getOneBook from "./routes/getOneBook.js";
import geminiRoutes from "./routes/geminiRoutes.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
const port = process.env.e_port || 3000;

const connectWithRetry = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await testConnection();
      await createTable(db);
      console.log("Database connected successfully");
      return;
    } catch (error) {
      console.error(`Database connection failed (attempt ${i + 1}):`, error);
      if (i < retries - 1) {
        console.log(`Retrying connection in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("Max retries reached. Could not connect to database.");
      }
    }
  }
};

connectWithRetry();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/get", getBookRouter);
app.use("/api/getOne", getOneBook);
app.use("/api", geminiRoutes);

app.use("/api", bookRouter);

app.listen(port, () => {
  console.log("Server is running on port : ", `http://localhost:${port}`);
});
