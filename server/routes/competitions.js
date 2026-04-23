import { Router } from "express";
import { getPool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        c.COMPETITION_ID AS id,
        v.VALUE          AS name
      FROM T_COMPETITIONS c
      JOIN T_DICT_VALUES v ON v.TERM_ID = c.NAME_ID AND v.LANG_ID = 1 AND v.IS_DEFAULT = 1
      WHERE v.VALUE IS NOT NULL AND v.VALUE <> ''
      ORDER BY v.VALUE
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/seasons", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("id", req.params.id)
      .query(`
        SELECT SEASON_NUM AS id
        FROM T_COMPETITION_SEASONS
        WHERE COMPETITION_ID = @id
        ORDER BY SEASON_NUM DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
