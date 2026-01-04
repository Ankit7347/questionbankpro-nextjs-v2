// src/scripts/init-db.ts

import mongoose from "mongoose";
import dbConnect from "../lib/mongodb";

// ---- FORCE SCHEMA REGISTRATION ----
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
// ----------------------------------

async function initDb() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await dbConnect();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("MongoDB connection not available");
    }

    console.log("📦 Ensuring collections & indexes...");

    // Iterate over all registered mongoose models
    for (const modelName of Object.keys(mongoose.models)) {
      const model = mongoose.models[modelName];
      const collectionName = model.collection.name;

      // 1️⃣ Ensure collection exists
      const collections = await db
        .listCollections({ name: collectionName })
        .toArray();

      if (collections.length === 0) {
        await db.createCollection(collectionName);
        console.log(`✅ Collection created: ${collectionName}`);
      } else {
        console.log(`ℹ️ Collection exists: ${collectionName}`);
      }

      // 2️⃣ Ensure indexes are created (THIS IS CRITICAL)
      await model.init();
      console.log(`📑 Indexes ensured for: ${collectionName}`);
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
//npx tsx src/scripts/init-db.ts 
// npx tsx src/scripts/seed/geolocation.seed.ts
// npx tsx src/scripts/seed/education.seed.ts
// npx tsx src/scripts/seed/syllabus.seed.ts
