import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true
    },
    operator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fuelAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Transaction", transactionSchema);