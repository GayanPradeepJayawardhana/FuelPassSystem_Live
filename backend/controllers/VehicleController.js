import Vehicle from "../models/Vehicle.js";
import SystemSettings from "../models/SystemSettings.js";
import User from "../models/User.js";
import generateQR from "../utils/qrGenerator.js";

// ADD VEHICLE
export const addVehicle = async (req, res) => {
    try {
        const { vehicleNumber, vehicleType } = req.body;

        // Get user with NIC and mobile
        const user = await User.findById(req.user._id);
        
        // Check if user already has a vehicle (one vehicle per user per NIC-phone combo)
        const existingVehicle = await Vehicle.findOne({ user: req.user._id });
        if (existingVehicle) {
            return res.status(400).json({ 
                message: `Only one vehicle is allowed per NIC (${user.NIC}) and phone number (${user.mobile})` 
            });
        }

        let settings = await SystemSettings.findOne();

        // Create default settings if they don't exist
        if (!settings) {
            settings = await SystemSettings.create({
                fuelQuotaByType: {
                    car: 50,
                    bike: 20,
                    van: 100,
                    bus: 150,
                    threewheel: 30
                }
            });
        }

        const quota = settings.fuelQuotaByType[vehicleType];

        // Create vehicle first
        const vehicle = await Vehicle.create({
            user: req.user._id,
            vehicleNumber,
            vehicleType,
            weeklyQuota: quota,
            remainingQuota: quota
        });

        // Generate QR data (important)
        const qrData = JSON.stringify({
            vehicleId: vehicle._id,
            userId: req.user._id
        });

        const qrCode = await generateQR(qrData);

        // Save QR
        vehicle.qrCode = qrCode;
        await vehicle.save();

        res.status(201).json(vehicle);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET USER VEHICLES
export const getUserVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ user: req.user._id });

        res.json(vehicles);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE VEHICLE
export const deleteVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;

        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // Check if user owns this vehicle
        if (vehicle.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this vehicle" });
        }

        await Vehicle.findByIdAndDelete(vehicleId);

        res.json({ message: "Vehicle deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};