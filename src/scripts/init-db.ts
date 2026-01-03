// src/scripts/init-db.ts

import mongoose from "mongoose";
import { dbConnect } from "../lib/mongodb";


// Force-load schemas
import "../models/mongoose/EducationLevel.schema";
import "../models/mongoose/Course.schema";
import "../models/mongoose/Exam.schema";
import "../models/mongoose/Syllabus.schema";
import "../models/mongoose/Subject.schema";
import "../models/mongoose/Chapter.schema";
import "../models/mongoose/Topic.schema";
import "../models/mongoose/CompetitiveTopicMap.schema";
import "../models/mongoose/Question.schema";
import "../models/mongoose/Quiz.schema";

import "../models/mongoose/BestBook.schema";
import "../models/mongoose/ContactUs.schema";
import "../models/mongoose/GeolocationState.schema";
import "../models/mongoose/GeolocationDistrict.schema";
import "../models/mongoose/ResetToken.schema";
import "../models/mongoose/User.schema";

async function initDb() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await dbConnect();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("MongoDB connection not available");
    }

    const collections = await db.collections();
    const existingNames = collections.map(
      (c) => c.collectionName
    );

    for (const modelName of Object.keys(mongoose.models)) {
      const collectionName = modelName.toLowerCase();

      if (!existingNames.includes(collectionName)) {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } else {
        console.log(`ℹ️ Collection already exists: ${collectionName}`);
      }
    }

    console.log("🎉 Database initialization complete.");
    process.exit(0);
  } catch (error) {
    console.error("❌ DB initialization failed:", error);
    process.exit(1);
  }
}

initDb();


//export MONGODB_URI="mongodb://root:root@localhost:27017/questionbankpro?authSource=admin"
//npx ts-node --project tsconfig.scripts.json src/scripts/init-db.ts