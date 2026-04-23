import { Router } from "express";
import { getPool, sql } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (q.length < 2) return res.json([]);
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("q", sql.NVarChar, `%${q}%`)
      .query(`
        SELECT TOP 20
          c.COMPETITOR_ID AS id,
          v.VALUE         AS name
        FROM T_COMPETITORS c
        JOIN T_DICT_VALUES v ON v.TERM_ID = c.NAME_ID AND v.LANG_ID = 1 AND v.IS_DEFAULT = 1
        WHERE v.VALUE LIKE @q
        ORDER BY v.VALUE
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
