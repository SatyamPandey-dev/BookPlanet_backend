import mysql from "mysql2/promise";
import { db } from "../config/db.js";

const createTable = async (db) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(50) NOT NULL,
      author VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      published_date DATE,
      publisher VARCHAR(255),
      book_url VARCHAR(500),
      cover_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await db.query(createTableQuery);
    console.log("Books table created successfully");
  } catch (error) {
    console.error("Error creating books table: ", error);
  }
};

export default createTable;
