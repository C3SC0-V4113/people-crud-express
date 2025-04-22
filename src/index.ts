import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.send(`PostgreSQL time: ${result.rows[0].now}`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
