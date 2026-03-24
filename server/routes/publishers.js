import { Router } from "express";
import { getPool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        PUBLISHER_ID  AS id,
        ALIAS_NAME    AS name,
        COUNTRY       AS countryId,
        LANG          AS langId,
        TIME_ZONE     AS timezone,
        IS_ACTIVE     AS isActive,
        TYPE          AS type
      FROM T_PUBLISHERS
      ORDER BY PUBLISHER_ID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publisher ↔ country settings
router.get("/countries", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT PUBLISHER_ID AS publisherId, COUNTRY_ID AS countryId, FILTER_ID AS filterId
      FROM T_PUBLISHER_COUNTRY_SETTING
      ORDER BY PUBLISHER_ID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
