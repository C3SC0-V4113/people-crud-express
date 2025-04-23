// src/initDb.ts

import { pool } from "../db";

async function initDb() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT,
      email TEXT UNIQUE,
      email_verified TIMESTAMP,
      image TEXT,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      type TEXT,
      provider TEXT,
      provider_account_id TEXT,
      refresh_token TEXT,
      access_token TEXT,
      expires_at BIGINT,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      UNIQUE(provider, provider_account_id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_token TEXT UNIQUE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      expires TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier TEXT,
      token TEXT UNIQUE,
      expires TIMESTAMP
    );
  `);

  console.log("Tablas creadas correctamente");
  process.exit();
}

initDb();
