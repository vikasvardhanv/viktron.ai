#!/usr/bin/env node

/**
 * Minimal auth DB bootstrap for restricted PostgreSQL roles.
 * Creates only the tables/indexes required for signup/login.
 */

import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  auth_provider VARCHAR(50),
  auth_provider_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const requiresSSL =
    connectionString.includes('sslmode=require') || connectionString.includes('ssl=require');

  const client = new Client({
    connectionString,
    ssl: requiresSSL ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log('AUTH_DB_INIT_OK');
  } catch (error) {
    console.error('AUTH_DB_INIT_FAILED:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
