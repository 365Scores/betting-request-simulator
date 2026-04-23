import { Router } from "express";
import { getPool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT SPORT_TYPE_ID AS id, ALIAS_NAME AS name
      FROM T_SPORT_TYPES
      WHERE ALIAS_NAME IS NOT NULL AND ALIAS_NAME <> '' AND IS_DISPLAYED = 1
      ORDER BY ALIAS_NAME
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
