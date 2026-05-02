import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(
      "mongodb://vipviratprajapat1_db_user:1234@ac-cl94kps-shard-00-00.jpgaklu.mongodb.net:27017,ac-cl94kps-shard-00-01.jpgaklu.mongodb.net:27017,ac-cl94kps-shard-00-02.jpgaklu.mongodb.net:27017/fitforge?ssl=true&replicaSet=atlas-2vgy5r-shard-0&authSource=admin&retryWrites=true&w=majority",
      {
        serverSelectionTimeoutMS: 5000,
      }
    );

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
