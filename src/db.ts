import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb://127.0.0.1:27017/brains"
    );
    if (connection) console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
