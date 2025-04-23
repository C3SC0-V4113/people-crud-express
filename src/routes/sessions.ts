import express from "express";
import { pool } from "../db";

const router = express.Router();

// Crear sesión
router.post("/", async (req, res) => {
  try {
    const { sessionToken, userId, expires } = req.body;
    console.log("Intentando crear sesión con userId:", userId);
    const result = await pool.query(
      `INSERT INTO sessions (id, session_token, user_id, expires)
           VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *`,
      [sessionToken, userId, expires]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear sesión:", error);
    res.status(500).json({ error: "Error al crear sesión" });
  }
});

// Obtener sesión y usuario
router.get("/:sessionToken", async (req, res) => {
  const result = await pool.query(
    `SELECT sessions.*, users.* FROM sessions
     JOIN users ON sessions.user_id = users.id
     WHERE session_token = $1`,
    [req.params.sessionToken]
  );

  if (result.rows.length > 0) {
    const session = {
      id: result.rows[0].id,
      sessionToken: result.rows[0].session_token,
      userId: result.rows[0].user_id,
      expires: result.rows[0].expires,
    };

    const user = {
      id: result.rows[0].user_id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      emailVerified: result.rows[0].email_verified,
      image: result.rows[0].image,
      phone: result.rows[0].phone,
      role: result.rows[0].role,
    };

    res.json({ session, user });
  } else {
    res.status(404).json(null);
  }
});

// Actualizar sesión
router.patch("/:sessionToken", async (req, res) => {
  const { expires } = req.body;
  const result = await pool.query(
    `UPDATE sessions SET expires = $1 WHERE session_token = $2 RETURNING *`,
    [expires, req.params.sessionToken]
  );
  res.json(result.rows[0]);
});

// Eliminar sesión
router.delete("/:sessionToken", async (req, res) => {
  await pool.query(`DELETE FROM sessions WHERE session_token = $1`, [
    req.params.sessionToken,
  ]);
  res.status(204).send();
});

export default router;
