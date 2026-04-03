const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/aiRoutes");
const foodRoutes = require("./routes/foodRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "12mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, message: "AnnSeva backend running" });
});

app.use("/api/ai", aiRoutes);
app.use("/api/food", foodRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ message });
});

module.exports = app;
