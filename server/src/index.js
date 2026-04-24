const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bfhlRouter = require("./routes/bfhl");

const app = express();
const PORT = process.env.PORT || 3001;

// Security & logging middleware
app.use(helmet());
app.use(morgan("dev"));

// CORS — allow all origins so the evaluator can call from any domain
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "BFHL API is running" });
});

// Main route
app.use("/bfhl", bfhlRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
