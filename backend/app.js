import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import operatorRoutes from "./routes/operatorRoutes.js";
import { resetWeeklyQuota } from "./utils/cronJobs.js";


const app = express();

// Middleware

app.use(express.json());
app.use(cors());
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/operator", operatorRoutes);
app.use("/api/admin", adminRoutes);

// Routes
app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// START CRON JOB
resetWeeklyQuota();

export default app;