import express from "express";
import { getAllUsers, getAllVehicles, updateFuelQuota, createSettings, getSettings, updateSettings, searchVehicle } from "../controllers/AdminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin only routes
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/vehicles", protect, authorizeRoles("admin"), getAllVehicles);
router.get("/search-vehicle", protect, authorizeRoles("admin"), searchVehicle);
router.put("/fuel/:vehicleId", protect, authorizeRoles("admin"), updateFuelQuota);

router.post("/settings", protect, authorizeRoles("admin"), createSettings);
router.get("/settings", protect, authorizeRoles("admin"), getSettings);
router.put("/settings", protect, authorizeRoles("admin"), updateSettings);

export default router;