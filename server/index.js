import express from "express";
import taskRoutes from "./routes/tasks.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ── Core Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(requestLogger);

// ── Routes ───────────────────────────────────────────────────────
app.use("/api/tasks", taskRoutes);

// Health-check
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Task Management API is running" });
});

// ── Global Error Handler (must be registered last) ───────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✔  Server listening on http://localhost:${PORT}`);
});
