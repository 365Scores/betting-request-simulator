import { Router } from "express";
import { getPool } from "../db.js";

const router = Router();

// All bookmakers
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        bm.BOOKMAKER_ID  AS id,
        bm.IS_INTERNATIONAL AS isInternational,
        bm.IS_VISIBLE       AS isVisible,
        bm.ORDER_RANK       AS orderRank,
        bm.COUNTRY_ID       AS countryId
      FROM T_BET_BOOKMAKERS bm
      ORDER BY bm.ORDER_RANK
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bookmaker ↔ country rules
router.get("/countries", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        BOOKMAKER_ID  AS bookmakerId,
        COUNTRY_ID    AS countryId,
        ORDER_RANK    AS orderRank,
        SPONSORED     AS sponsored
      FROM T_BET_BOOKMAKER_COUNTRIES
      ORDER BY BOOKMAKER_ID, ORDER_RANK
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Country bans per bookmaker
router.get("/bans", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT BOOKMAKER_ID AS bookmakerId, COUNTRY_ID AS countryId
      FROM T_BOOKMAKERS_COUNTRY_BAN
      ORDER BY BOOKMAKER_ID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
