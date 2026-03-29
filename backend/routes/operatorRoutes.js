import express from "express";
import { verifyVehicle, fuelVehicle } from "../controllers/operatorController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Operator only
router.post("/verify", protect, authorizeRoles("operator"), verifyVehicle);
router.post("/fuel", protect, authorizeRoles("operator"), fuelVehicle);

export default router;