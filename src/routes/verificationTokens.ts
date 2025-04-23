import express from "express";
import { pool } from "../db";

const router = express.Router();

// Crear token
router.post("/", async (req, res) => {
  const { identifier, token, expires } = req.body;
  const result = await pool.query(
    `INSERT INTO verification_tokens (identifier, token, expires)
     VALUES ($1, $2, $3) RETURNING *`,
    [identifier, token, expires]
  );
  res.status(201).json(result.rows[0]);
});

// Usar y eliminar token
router.post("/use", async (req, res) => {
  const { identifier, token } = req.body;
  const result = await pool.query(
    `DELETE FROM verification_tokens WHERE identifier = $1 AND token = $2 RETURNING *`,
    [identifier, token]
  );
  if (result.rows.length > 0) {
    res.json(result.rows[0]);
  } else {
    res.status(404).json(null);
  }
});

export default router;
