import { pool } from "../database.js";
import bcrypt from "bcrypt";

export const findAllUsers = async () => {
  const { rows } = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC"
  );
  return rows;
};

export const findUserById = async (id) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = $1 AND deleted_at IS NULL",
    [id]
  );
  return rows[0];
};

export const findUserByEmail = async (email) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL",
    [email]
  );
  return rows;
};

export const createUserService = async (name, email, password, role) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { rows } = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at",
    [name, email, hashedPassword, role]
  );
  return rows[0];
};

export const updateUserService = async (id, name, email, password, role) => {
  let query = "UPDATE users SET name = $1, email = $2, role = $3";
  let values = [name, email, role];
  
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    query += ", password = $4 WHERE id = $5 AND deleted_at IS NULL RETURNING id, name, email, role, created_at";
    values.push(hashedPassword, id);
  } else {
    query += " WHERE id = $4 AND deleted_at IS NULL RETURNING id, name, email, role, created_at";
    values.push(id);
  }

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const deleteUserService = async (id) => {
  const { rowCount } = await pool.query(
    "UPDATE users SET deleted_at = timezone('utc'::text, now()) WHERE id = $1 AND deleted_at IS NULL",
    [id]
  );
  return rowCount;
};
