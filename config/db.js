import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
// Create __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Now use path.join with your CA file
const caPath = path.join(__dirname, "isrgrootx1.pem");

export const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: fs.readFileSync(caPath),
    minVersion: "TLSv1.2",
    rejectUnauthorized: false,
  },
  keepAliveInitialDelay: 10000,
  enableKeepAlive: true,
});

export const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("Database connection failed: ", error);
  }
};
