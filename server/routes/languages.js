import { Router } from "express";
import { getPool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        l.LANGUAGE_ID        AS id,
        l.CULTURE_NAME       AS cultureName,
        l.ISO_2_LETTERS_CODE AS iso2,
        l.ISO_3_LETTERS_CODE AS iso3,
        l.DIRECTION          AS direction,
        l.IS_DISPLAYED       AS isDisplayed,
        l.FATHER_LANG_ID     AS parentLangId,
        l.LANG_TYPE          AS langType,
        dv.VALUE             AS name
      FROM T_LANGUAGES l
      LEFT JOIN T_DICT_VALUES dv
        ON dv.TERM_ID = l.NAME_ID
        AND dv.LANG_ID = 1
      WHERE l.LANG_TYPE = 1
        AND dv.VALUE NOT IN ('WEB', 'BUZZ')
      ORDER BY dv.VALUE
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
