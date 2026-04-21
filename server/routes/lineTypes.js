import { Router } from "express";
import { getPool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        LINE_TYPE_ID AS id,
        ALIAS_NAME   AS name
      FROM T_BET_LINE_TYPES
      WHERE VISIBLE = 1
      ORDER BY ALIAS_NAME
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
