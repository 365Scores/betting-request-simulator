import { Router } from "express";
import { getPool } from "../db.js";

// Known mapping: DEFAULT_USER_CURRENCY id → canonical ISO code
const CURRENCY_NAMES = { 1: "EUR", 2: "USD", 3: "GBP", 4: "BRL" };

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT DISTINCT DEFAULT_USER_CURRENCY AS id
      FROM T_COUNTRIES
      WHERE DEFAULT_USER_CURRENCY IS NOT NULL
      ORDER BY DEFAULT_USER_CURRENCY
    `);
    const rows = result.recordset.map((r) => ({
      id: r.id,
      name: CURRENCY_NAMES[r.id] ?? `Currency ${r.id}`,
    }));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
