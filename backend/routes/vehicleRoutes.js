import express from "express";
import { addVehicle, getUserVehicles, deleteVehicle } from "../controllers/VehicleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// User routes
router.post("/", protect, authorizeRoles("user"), addVehicle);
router.get("/my", protect, authorizeRoles("user"), getUserVehicles);
router.delete("/:vehicleId", protect, authorizeRoles("user"), deleteVehicle);

export default router;