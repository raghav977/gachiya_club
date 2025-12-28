import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './src/config/db.js';
import eventRouter from "./src/routes/eventRoutes.js";
import syncDatabase from './src/services/relation_table.js';
import playerRouter from "./src/routes/playerRoutes.js";
import categoryRouter from "./src/routes/categoryRoutes.js";
import adminRouter from "./src/routes/adminRoutes.js";
import noticeRouter from "./src/routes/noticeRoutes.js";
import resourceRouter from "./src/routes/resourcesRoutes.js";
import galleryRouter from "./src/routes/galleryRoutes.js";
import inquiryRouter from "./src/routes/inquiryRoute.js";
import memberRouter from "./src/routes/memberRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
app.use(cors({
  origin: FRONTEND_ORIGIN,
  methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later."
});


app.use(globalLimiter);


const sensitiveLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5, 
  message: "Too many requests from this IP, please try again later."
});


app.use("/api/player/register", sensitiveLimiter);
app.use("/api/admin", sensitiveLimiter);


app.use("/api/event", eventRouter);
app.use("/api/player", playerRouter);
app.use("/api/category", categoryRouter);
app.use("/api/notice", noticeRouter);
app.use("/api/resource", resourceRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/member", memberRouter);
app.use("/api", adminRouter);


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
