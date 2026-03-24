import { Router } from "express";
import { getPool } from "../db.js";

const router = Router();

// All countries with English names
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        c.COUNTRY_ID   AS id,
        c.COUNTRY_CODE AS code,
        c.TIME_ZONE_ID AS timezone,
        dv.VALUE       AS name
      FROM T_COUNTRIES c
      LEFT JOIN T_DICT_VALUES dv
        ON dv.TERM_ID = c.NAME_ID
        AND dv.LANG_ID = 1
      WHERE c.IS_NOT_REAL = 0
      ORDER BY dv.VALUE
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Language ↔ country mapping
router.get("/languages", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT COUNTRY_ID AS countryId, LANG_ID AS langId, SEQUENCE AS sequence
      FROM T_LANG_OF_COUNTRIES
      ORDER BY COUNTRY_ID, SEQUENCE
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
