import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const getUsersTableColumns = async () => {
  const result = await query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'users'`
  );
  return new Set(result.rows.map((r) => r.column_name));
};

const normalizeUserRow = (row = {}) => ({
  ...row,
  full_name: row.full_name || row.name || row.fullName || null,
  company: row.company ?? null,
  phone: row.phone ?? null,
  role: row.role || 'user',
});

const buildInsertStatement = (columns, values) => {
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
  return {
    sql: `INSERT INTO users (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`,
    params: values,
  };
};

export const User = {
  // Create a new user with email/password
  async create({ email, password, fullName, company, phone }) {
    const passwordHash = await bcrypt.hash(password, 12);

    const columns = await getUsersTableColumns();
    const insertColumns = [];
    const insertValues = [];

    if (!columns.has('email')) {
      throw new Error('users.email column is required for signup');
    }
    insertColumns.push('email');
    insertValues.push(email.toLowerCase());

    if (columns.has('password_hash')) {
      insertColumns.push('password_hash');
      insertValues.push(passwordHash);
    } else if (columns.has('password')) {
      insertColumns.push('password');
      insertValues.push(passwordHash);
    } else {
      throw new Error('users.password_hash/password column is required for signup');
    }

    if (columns.has('full_name')) {
      insertColumns.push('full_name');
      insertValues.push(fullName);
    } else if (columns.has('name')) {
      insertColumns.push('name');
      insertValues.push(fullName);
    }

    if (columns.has('company')) {
      insertColumns.push('company');
      insertValues.push(company || null);
    }
    if (columns.has('phone')) {
      insertColumns.push('phone');
      insertValues.push(phone || null);
    }

    const { sql, params } = buildInsertStatement(insertColumns, insertValues);
    const result = await query(sql, params);
    return normalizeUserRow(result.rows[0]);
  },

  // Create a new user via OAuth (no password required)
  async createOAuthUser({ email, fullName, provider, providerId }) {
    // Generate a random password hash for OAuth users (they won't use it)
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(randomPassword, 12);

    const nameValue = fullName || email.split('@')[0];
    const columns = await getUsersTableColumns();
    const insertColumns = [];
    const insertValues = [];

    if (!columns.has('email')) {
      throw new Error('users.email column is required for OAuth');
    }
    insertColumns.push('email');
    insertValues.push(email.toLowerCase());

    if (columns.has('password_hash')) {
      insertColumns.push('password_hash');
      insertValues.push(passwordHash);
    } else if (columns.has('password')) {
      insertColumns.push('password');
      insertValues.push(passwordHash);
    } else {
      throw new Error('users.password_hash/password column is required for OAuth');
    }

    if (columns.has('full_name')) {
      insertColumns.push('full_name');
      insertValues.push(nameValue);
    } else if (columns.has('name')) {
      insertColumns.push('name');
      insertValues.push(nameValue);
    }

    if (columns.has('auth_provider')) {
      insertColumns.push('auth_provider');
      insertValues.push(provider);
    }
    if (columns.has('auth_provider_id')) {
      insertColumns.push('auth_provider_id');
      insertValues.push(providerId);
    }
    if (columns.has('email_verified')) {
      insertColumns.push('email_verified');
      insertValues.push(true);
    }

    const { sql, params } = buildInsertStatement(insertColumns, insertValues);
    const result = await query(sql, params);
    return normalizeUserRow(result.rows[0]);
  },

  // Find user by email
  async findByEmail(email) {
    const result = await query(
      `SELECT * FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    return result.rows[0] ? normalizeUserRow(result.rows[0]) : null;
  },

  // Find user by ID
  async findById(id) {
    const result = await query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] ? normalizeUserRow(result.rows[0]) : null;
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // Update last login
  async updateLastLogin(id) {
    await query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );
  },

  // Check if email exists
  async emailExists(email) {
    const result = await query(
      `SELECT id FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    return result.rows.length > 0;
  },

  // Update user profile
  async updateProfile(id, { fullName, company, phone }) {
    const columns = await getUsersTableColumns();
    const updates = [];
    const params = [id];
    let i = 2;

    if (fullName !== undefined) {
      if (columns.has('full_name')) {
        updates.push(`full_name = COALESCE($${i}, full_name)`);
        params.push(fullName);
        i += 1;
      } else if (columns.has('name')) {
        updates.push(`name = COALESCE($${i}, name)`);
        params.push(fullName);
        i += 1;
      }
    }
    if (columns.has('company') && company !== undefined) {
      updates.push(`company = COALESCE($${i}, company)`);
      params.push(company);
      i += 1;
    }
    if (columns.has('phone') && phone !== undefined) {
      updates.push(`phone = COALESCE($${i}, phone)`);
      params.push(phone);
      i += 1;
    }

    if (updates.length === 0) {
      const current = await this.findById(id);
      return current;
    }

    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );
    return result.rows[0] ? normalizeUserRow(result.rows[0]) : null;
  }
};

export default User;
