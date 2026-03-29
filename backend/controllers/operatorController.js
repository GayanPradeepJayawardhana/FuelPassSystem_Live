import Vehicle from "../models/Vehicle.js";
import Transaction from "../models/Transaction.js";

// SCAN QR → VERIFY VEHICLE
export const verifyVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.body;

        const vehicle = await Vehicle.findById(vehicleId).populate("user", "firstName lastName NIC mobile address");

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.json(vehicle);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PROCESS FUEL
export const fuelVehicle = async (req, res) => {
    try {
        const { vehicleId, fuelAmount } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        if (vehicle.remainingQuota < fuelAmount) {
            return res.status(400).json({ message: "Not enough quota" });
        }

        // Deduct quota
        vehicle.remainingQuota -= fuelAmount;
        await vehicle.save();

        // Save transaction
        const transaction = await Transaction.create({
            vehicle: vehicle._id,
            operator: req.user._id,
            fuelAmount
        });

        res.json({
            message: "Fuel successful",
            remainingQuota: vehicle.remainingQuota,
            transaction
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};