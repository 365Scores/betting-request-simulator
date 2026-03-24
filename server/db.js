import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const config = {
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

export async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log("Connected to SQL Server:", process.env.DB_NAME);
  }
  return pool;
}

export { sql };
