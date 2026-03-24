import { Router } from "express";
import { getPool } from "../db.js";

const router = Router();

// List all tables — used to explore the schema
router.get("/tables", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT TABLE_NAME, TABLE_TYPE
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Preview columns of a specific table
router.get("/tables/:tableName/columns", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("table", req.params.tableName)
      .query(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = @table
        ORDER BY ORDINAL_POSITION
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
