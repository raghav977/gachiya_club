import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './src/config/db.js';
import eventRouter from "./src/routes/eventRoutes.js";
import syncDatabase from './src/services/relation_table.js';
import playerRouter from "./src/routes/playerRoutes.js";
import categoryRouter from "./src/routes/categoryRoutes.js";
import adminRouter from "./src/routes/adminRoutes.js";
import path from "path";
import { fileURLToPath } from "url"; // <-- add this
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS setup
const corsOptions = {
  origin: 'http://localhost:3001', 
  methods: 'GET,POST',             
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

// enable CORS (allow frontend origin or all if not provided)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3001";
const effectiveCorsOptions = {
  origin: FRONTEND_ORIGIN,
  methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(effectiveCorsOptions));
app.use(express.json());

// Serve uploaded files publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
app.use("/api/event", eventRouter);
app.use("/api/player", playerRouter);
app.use("/api/category", categoryRouter);
app.use("/api", adminRouter);


// Static uploads folder


const startServer = async () => {
  try {
    await connectDB(); 
    await syncDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();