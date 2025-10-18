import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
        // console.log(`MongoDB connected: ${connection.connection.host}`);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.log(error);   
        process.exit(1);
    }
}

export default connectMongoDB;