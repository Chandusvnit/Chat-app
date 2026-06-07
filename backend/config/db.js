import mongoose  from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async() =>{
    try {
        const conn =  await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Databases Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;

// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

// async function connectDB() {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Database Connection Error: ${error.message}`);
//     process.exit(1);
//   }
// }

// export default connectDB;