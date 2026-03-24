import { Router } from "express";
import { getPool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        LANGUAGE_ID       AS id,
        CULTURE_NAME      AS cultureName,
        ISO_2_LETTERS_CODE AS iso2,
        ISO_3_LETTERS_CODE AS iso3,
        DIRECTION         AS direction,
        IS_DISPLAYED      AS isDisplayed,
        FATHER_LANG_ID    AS parentLangId
      FROM T_LANGUAGES
      ORDER BY LANGUAGE_ID
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
