import express from "express";
import { pool } from "../db";

const router = express.Router();

// Crear cuenta
router.post("/", async (req, res) => {
  const {
    userId,
    type,
    provider,
    providerAccountId,
    refreshToken,
    accessToken,
    expiresAt,
    tokenType,
    scope,
    idToken,
    sessionState,
  } = req.body;

  const result = await pool.query(
    `INSERT INTO accounts (id, user_id, type, provider, provider_account_id, refresh_token,
     access_token, expires_at, token_type, scope, id_token, session_state)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [
      userId,
      type,
      provider,
      providerAccountId,
      refreshToken,
      accessToken,
      expiresAt,
      tokenType,
      scope,
      idToken,
      sessionState,
    ]
  );
  res.status(201).json(result.rows[0]);
});

// Obtener cuenta por provider/providerAccountId
router.get("/", async (req, res) => {
  const { provider, providerAccountId } = req.query;
  // const result = await pool.query(
  //   `SELECT * FROM accounts WHERE provider = $1 AND provider_account_id = $2`,
  //   [provider, providerAccountId]
  // );
  // res.json(result.rows[0] || null);

  const result = await pool.query(
    `
      SELECT u.*
      FROM accounts a
      JOIN users u ON a.user_id = u.id
      WHERE a.provider = $1 AND a.provider_account_id = $2
      LIMIT 1
    `,
    [provider, providerAccountId]
  );

  res.json(result.rows[0]); // ← Devuelve directamente el usuario
});

// Eliminar cuenta
router.delete("/", async (req, res) => {
  const { provider, providerAccountId } = req.body;
  await pool.query(
    `DELETE FROM accounts WHERE provider = $1 AND provider_account_id = $2`,
    [provider, providerAccountId]
  );
  res.status(204).send();
});

export default router;
