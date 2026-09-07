import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

let pool: mysql.Pool | null = null;

export function getConnectionPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not defined");
    }

    pool = mysql.createPool({
      uri: connectionString,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      timezone: "local", // Use local timezone - datetime strings are stored as-is
    });
  }

  return pool;
}

export const db = drizzle(getConnectionPool(), { schema, mode: "default" });

// Function to test database connection
export async function testConnection() {
  try {
    const connection = await getConnectionPool().getConnection();
    connection.release();
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
}

// Graceful shutdown
export async function closeConnection() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
