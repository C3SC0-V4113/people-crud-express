import express from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res): Promise<any> => {
  const { name, email, password } = req.body;

  try {
    // Verifica si el usuario ya existe
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email ya registrado" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, role, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'user', NOW(), NOW())
       RETURNING *`,
      [name, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al registrar:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Crear usuario
router.post("/", async (req, res) => {
  try {
    const { name, email, emailVerified, image, phone, role } = req.body;

    const result = await pool.query(
      `INSERT INTO users (id, name, email, email_verified, image, phone, role)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, emailVerified, image, phone, role || "user"]
    );

    console.log("Usuario insertado:", result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// Obtener usuario por ID
router.get("/:id", async (req, res) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    req.params.id,
  ]);
  res.json(result.rows[0] || null);
});

// Obtener usuario por Email
router.get("/email/:email", async (req, res) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    req.params.email,
  ]);
  res.json(result.rows[0] || null);
});

// Actualizar usuario
router.patch("/:id", async (req, res) => {
  const { name, email, emailVerified, image, phone, role } = req.body;
  const result = await pool.query(
    `UPDATE users SET name = $1, email = $2, email_verified = $3, image = $4, phone = $5, role = $6
     WHERE id = $7 RETURNING *`,
    [name, email, emailVerified, image, phone, role, req.params.id]
  );
  res.json(result.rows[0]);
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
  res.status(204).send();
});

export default router;
