import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    // Returning conn allows the .then() in server.js to know we are successful
    return conn;
  } catch (error) {
    // Instead of exiting here, we throw the error
    // so the .catch() in server.js can handle the final shutdown
    throw error;
  }
};

export default connectDB;
