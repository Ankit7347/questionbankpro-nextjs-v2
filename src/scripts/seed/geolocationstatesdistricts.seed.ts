import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { initSeed, closeSeed } from "./_helpers";
import GeolocationState from "../../models/mongoose/GeolocationState.schema";
import GeolocationDistrict from "../../models/mongoose/GeolocationDistrict.schema";

/**
 * Helper to read JSON files from the current directory
 */
const readJsonFile = (fileName: string) => {
  const filePath = path.join(__dirname, fileName);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

async function seedGeolocation() {
  try {
    await initSeed();
    console.log("🚀 Starting Geolocation Seed from JSON files...");

    // 1. Load Data from Files
    const statesData = readJsonFile("states.json");
    const districtsData = readJsonFile("districts.json");

    // 2. Sync States
    console.log(`⏳ Syncing ${statesData.length} States...`);
    for (const state of statesData) {
      await GeolocationState.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(state._id.$oid) },
        {
          stateName: state.stateName,
          stateCode: state.stateCode || "", // Optional if you have codes
          isDeleted: state.isDeleted || false,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // 3. Sync Districts
    console.log(`⏳ Syncing ${districtsData.length} Districts...`);
    for (const dist of districtsData) {
      // Ensure the reference ID is valid
      const stateId = dist.geolocationStateId?.$oid || dist.geolocationStateId;
      
      await GeolocationDistrict.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(dist._id.$oid) },
        {
          districtName: dist.districtName,
          geolocationStateId: new mongoose.Types.ObjectId(stateId),
          isDeleted: dist.isDeleted || false,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log("✅ Geolocation Sync Completed!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await closeSeed();
  }
}

seedGeolocation();