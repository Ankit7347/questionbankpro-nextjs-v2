import mongoose from "mongoose";
import dbConnect from "../../lib/mongodb";

export async function initSeed() {
  await dbConnect();
}

export async function closeSeed() {
  await mongoose.connection.close();
}
