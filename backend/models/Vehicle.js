import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },

    vehicleType: {
        type: String,
        enum: ["car", "bike", "van", "bus", "threewheel"],
        required: true
    },

    weeklyQuota: {
        type: Number,
        required: true
    },

    remainingQuota: {
        type: Number,
        required: true
    },

    qrCode: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Enforce one vehicle per user (per NIC and phone number)
vehicleSchema.index({ "user": 1 }, { unique: false });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;