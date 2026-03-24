import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getPool } from "./db.js";
import schemaRouter from "./routes/schema.js";
import bookmakersRouter from "./routes/bookmakers.js";
import languagesRouter from "./routes/languages.js";
import countriesRouter from "./routes/countries.js";
import publishersRouter from "./routes/publishers.js";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/schema",     schemaRouter);
app.use("/api/bookmakers", bookmakersRouter);
app.use("/api/languages",  languagesRouter);
app.use("/api/countries",  countriesRouter);
app.use("/api/publishers", publishersRouter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Connect to DB then start server
getPool()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });
