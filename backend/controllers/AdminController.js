import SystemSettings from "../models/SystemSettings.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL VEHICLES
export const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate("user", "firstName lastName NIC mobile address");
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SEARCH VEHICLE BY REGISTRATION NUMBER
export const searchVehicle = async (req, res) => {
    try {
        const { vehicleNumber } = req.query;

        if (!vehicleNumber) {
            return res.status(400).json({ message: "Vehicle number required" });
        }

        // Case-insensitive search
        const vehicles = await Vehicle.find({ 
            vehicleNumber: { $regex: vehicleNumber, $options: 'i' } 
        }).populate("user", "firstName lastName NIC mobile address");

        res.json(vehicles);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE FUEL QUOTA FOR A VEHICLE
export const updateFuelQuota = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const { fuelAmount } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        vehicle.remainingQuota = fuelAmount;
        await vehicle.save();

        res.json({ message: "Fuel quota updated successfully", vehicle });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE SETTINGS (only once)
export const createSettings = async (req, res) => {
    try {
        const existing = await SystemSettings.findOne();

        if (existing) {
            return res.status(400).json({ message: "Settings already exist" });
        }

        const settings = await SystemSettings.create(req.body);

        res.status(201).json(settings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SETTINGS
export const getSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.findOne();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE SETTINGS
export const updateSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.findOne();

        if (!settings) {
            return res.status(404).json({ message: "Settings not found" });
        }

        Object.assign(settings, req.body);
        await settings.save();

        res.json(settings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};