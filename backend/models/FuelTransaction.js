import mongoose from "mongoose";

const fuelTransactionSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    fuelAmount: {
        type: Number,
        required: true
    },

    filledAt: {
        type: Date,
        default: Date.now
    },

    operator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const FuelTransaction = mongoose.model("FuelTransaction", fuelTransactionSchema);

export default FuelTransaction;