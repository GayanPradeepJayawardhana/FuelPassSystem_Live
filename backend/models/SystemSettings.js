import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({
    fuelQuotaByType: {
        car: { type: Number, default: 20 },
        bike: { type: Number, default: 10 },
        van: { type: Number, default: 25 },
        bus: { type: Number, default: 50 },
        threewheel: { type: Number, default: 15 }
    },

    resetDay: {
        type: String,
        enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        default: "Sunday"
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const SystemSettings = mongoose.model("SystemSettings", systemSettingsSchema);

export default SystemSettings;