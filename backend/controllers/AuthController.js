import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// REGISTER
export const registerUser = async (req, res) => {
    try {
        const { NIC, firstName, lastName, mobile, address, password } = req.body;

        // Validate required fields
        if (!NIC || !firstName || !mobile || !address || !password) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        // Validate mobile number length (exactly 10 digits)
        if (!/^\d{10}$/.test(mobile)) {
            return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
        }

        // Check if NIC already exists
        const nicExists = await User.findOne({ NIC });
        if (nicExists) {
            return res.status(400).json({ message: "NIC already registered. Please use a different NIC" });
        }

        // Check if mobile number already exists
        const mobileExists = await User.findOne({ mobile });
        if (mobileExists) {
            return res.status(400).json({ message: "Mobile number already registered. Please use a different phone number" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            NIC,
            firstName,
            lastName: lastName || '',
            mobile,
            address,
            password: hashedPassword
        });

        res.status(201).json({
            _id: user._id,
            NIC: user.NIC,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            token: generateToken(user._id, user.role)
        });

    } catch (error) {
        // Handle Mongoose validation errors
        if (error.message.includes('mobile')) {
            return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
        }
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
export const loginUser = async (req, res) => {
    try {
        const { NIC, password } = req.body;

        const user = await User.findOne({ NIC });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                NIC: user.NIC,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(401).json({ message: "Invalid NIC or password" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};