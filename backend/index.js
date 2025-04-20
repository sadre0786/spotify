import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api,
  api_secret: process.env.Cloud_Secret,
});

const app = express();

// 👇 Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());

// using middlewares
app.use(express.json());

const port = process.env.PORT;

// importing routes
import userRoutes from "./routes/userRoutes.js";
import songRoutes from "./routes/songRoutes.js";

// using routes
app.use("/api/user", userRoutes);
app.use("/api/song", songRoutes);

// 👇 Path to frontend's dist folder
const frontendPath = path.resolve(__dirname, "../frontend/dist");
// 👇 Serve static files from frontend
app.use(express.static(frontendPath));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.url.startsWith("/api")) {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  connectDb();
});
