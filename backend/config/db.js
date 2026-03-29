import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Fix duplicate key error by dropping old indexes
        try {
            const usersCollection = mongoose.connection.collection('users');
            await usersCollection.dropIndex('email_1').catch(() => {});
            console.log('Cleaned up old email index if it existed');
        } catch (indexError) {
            // Index might not exist, that's okay
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;