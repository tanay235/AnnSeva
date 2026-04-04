const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const requestRoutes = require("./routes/requestRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "12mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, ok: true, message: "AnnSeva backend running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);

// Error handling middleware (MUST be last)
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  console.error(`[Error] Status: ${status}, Message: ${message}`, err);
  res.status(status).json({ 
    success: false,
    message
  });
});

module.exports = app;
