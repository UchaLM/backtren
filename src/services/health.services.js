import { pool } from "../database.js";

export const checkDatabaseHealth = async () => {
  const dbCheck = await pool.query("SELECT NOW()");
  return dbCheck.rows[0].now;
};
