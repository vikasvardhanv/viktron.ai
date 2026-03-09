import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const getUsersTableSchema = async () => {
  try {
    const result = await query(
      `SELECT column_name, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'users'`
    );

    const schema = new Map();
    for (const row of result.rows) {
      schema.set(row.column_name, {
        nullable: row.is_nullable === 'YES',
        hasDefault: row.column_default !== null,
      });
    }
    return schema;
  } catch {
    // Some managed DB roles restrict metadata visibility.
    return null;
  }
};

const hasColumn = (schema, name) => {
  if (!schema) return false;
  return schema.has(name);
};

const needsValue = (schema, name) => {
  if (!schema || !schema.has(name)) return false;
  const col = schema.get(name);
  return !col.nullable && !col.hasDefault;
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

const getDefaultColumnValue = (column, ctx) => {
  const defaults = {
    id: crypto.randomUUID(),
    role: 'user',
    company: '',
    phone: '',
    email_verified: !!ctx.oauth,
    full_name: ctx.nameValue || 'User',
    name: ctx.nameValue || 'User',
    auth_provider: ctx.provider || 'email',
    auth_provider_id: ctx.providerId || `email:${ctx.email?.toLowerCase?.() || 'unknown'}`,
    created_at: new Date(),
    updated_at: new Date(),
    last_login: new Date(),
  };
  return Object.prototype.hasOwnProperty.call(defaults, column) ? defaults[column] : null;
};

const executeUserInsertWithFallback = async (columns, values, ctx) => {
  const workingColumns = [...columns];
  const workingValues = [...values];

  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      const { sql, params } = buildInsertStatement(workingColumns, workingValues);
      return await query(sql, params);
    } catch (error) {
      // Missing required column in strict schema: try adding safe default and retry.
      if (error?.code === '23502' && error?.column && !workingColumns.includes(error.column)) {
        const fallback = getDefaultColumnValue(error.column, ctx);
        if (fallback !== null) {
          workingColumns.push(error.column);
          workingValues.push(fallback);
          continue;
        }
      }

      // Unknown column in evolving schema: remove and retry.
      if (error?.code === '42703' && error?.column) {
        const idx = workingColumns.indexOf(error.column);
        if (idx >= 0) {
          workingColumns.splice(idx, 1);
          workingValues.splice(idx, 1);
          continue;
        }
      }

      throw error;
    }
  }

  throw new Error('Unable to insert user after schema fallback attempts');
};

export const User = {
  // Create a new user with email/password
  async create({ email, password, fullName, company, phone }) {
    const passwordHash = await bcrypt.hash(password, 12);

    const schema = await getUsersTableSchema();

    // Fallback to legacy query path when schema metadata is unavailable.
    if (!schema) {
      const result = await executeUserInsertWithFallback(
        ['email', 'password_hash', 'full_name', 'company', 'phone', 'role'],
        [email.toLowerCase(), passwordHash, fullName, company || '', phone || '', 'user'],
        { email, nameValue: fullName, oauth: false }
      );
      return normalizeUserRow(result.rows[0]);
    }

    const insertColumns = [];
    const insertValues = [];

    if (!hasColumn(schema, 'email')) {
      throw new Error('users.email column is required for signup');
    }
    insertColumns.push('email');
    insertValues.push(email.toLowerCase());

    if (hasColumn(schema, 'password_hash')) {
      insertColumns.push('password_hash');
      insertValues.push(passwordHash);
    } else if (hasColumn(schema, 'password')) {
      insertColumns.push('password');
      insertValues.push(passwordHash);
    } else {
      throw new Error('users.password_hash/password column is required for signup');
    }

    if (hasColumn(schema, 'full_name')) {
      insertColumns.push('full_name');
      insertValues.push(fullName);
    } else if (hasColumn(schema, 'name')) {
      insertColumns.push('name');
      insertValues.push(fullName);
    }

    if (hasColumn(schema, 'company')) {
      insertColumns.push('company');
      insertValues.push(company || (needsValue(schema, 'company') ? '' : null));
    }
    if (hasColumn(schema, 'phone')) {
      insertColumns.push('phone');
      insertValues.push(phone || (needsValue(schema, 'phone') ? '' : null));
    }
    if (hasColumn(schema, 'role')) {
      insertColumns.push('role');
      insertValues.push('user');
    }
    if (hasColumn(schema, 'email_verified')) {
      insertColumns.push('email_verified');
      insertValues.push(false);
    }

    const result = await executeUserInsertWithFallback(insertColumns, insertValues, {
      email,
      nameValue: fullName,
      oauth: false,
    });
    return normalizeUserRow(result.rows[0]);
  },

  // Create a new user via OAuth (no password required)
  async createOAuthUser({ email, fullName, provider, providerId }) {
    // Generate a random password hash for OAuth users (they won't use it)
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(randomPassword, 12);

    const nameValue = fullName || email.split('@')[0];
    const schema = await getUsersTableSchema();

    if (!schema) {
      const result = await executeUserInsertWithFallback(
        ['email', 'password_hash', 'full_name', 'auth_provider', 'auth_provider_id', 'email_verified', 'role'],
        [email.toLowerCase(), passwordHash, nameValue, provider, providerId, true, 'user'],
        { email, nameValue, oauth: true, provider, providerId }
      );
      return normalizeUserRow(result.rows[0]);
    }

    const insertColumns = [];
    const insertValues = [];

    if (!hasColumn(schema, 'email')) {
      throw new Error('users.email column is required for OAuth');
    }
    insertColumns.push('email');
    insertValues.push(email.toLowerCase());

    if (hasColumn(schema, 'password_hash')) {
      insertColumns.push('password_hash');
      insertValues.push(passwordHash);
    } else if (hasColumn(schema, 'password')) {
      insertColumns.push('password');
      insertValues.push(passwordHash);
    } else {
      throw new Error('users.password_hash/password column is required for OAuth');
    }

    if (hasColumn(schema, 'full_name')) {
      insertColumns.push('full_name');
      insertValues.push(nameValue);
    } else if (hasColumn(schema, 'name')) {
      insertColumns.push('name');
      insertValues.push(nameValue);
    }

    if (hasColumn(schema, 'auth_provider')) {
      insertColumns.push('auth_provider');
      insertValues.push(provider);
    }
    if (hasColumn(schema, 'auth_provider_id')) {
      insertColumns.push('auth_provider_id');
      insertValues.push(providerId);
    }
    if (hasColumn(schema, 'email_verified')) {
      insertColumns.push('email_verified');
      insertValues.push(true);
    }
    if (hasColumn(schema, 'role')) {
      insertColumns.push('role');
      insertValues.push('user');
    }

    const result = await executeUserInsertWithFallback(insertColumns, insertValues, {
      email,
      nameValue,
      oauth: true,
      provider,
      providerId,
    });
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
    const schema = await getUsersTableSchema();
    if (!schema) {
      const current = await this.findById(id);
      return current;
    }
    const columns = new Set(schema.keys());
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
