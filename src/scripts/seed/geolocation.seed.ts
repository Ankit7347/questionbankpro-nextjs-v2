// src/scripts/seed/geolocation.seed.ts

import { initSeed, closeSeed } from "./_helpers";
import { GeolocationStateModel } from "../../models/mongoose/GeolocationState.schema";
import { GeolocationDistrictModel } from "../../models/mongoose/GeolocationDistrict.schema";

const DATA = [
  {
    state: "Uttar Pradesh",
    code: "UP",
    districts: ["Lucknow", "Kanpur", "Varanasi"],
  },
  {
    state: "Maharashtra",
    code: "MH",
    districts: ["Mumbai", "Pune", "Nagpur"],
  },
];

async function seedGeolocation() {
  console.log("🌍 Seeding geolocation...");
  await initSeed();

  for (const entry of DATA) {
    let state = await GeolocationStateModel.findOne({
      name: entry.state,
      isDeleted: false,
    });

    if (!state) {
      state = await GeolocationStateModel.create({
        name: entry.state,
        code: entry.code,
      });
      console.log(`✅ State added: ${entry.state}`);
    }

    for (const district of entry.districts) {
      const exists = await GeolocationDistrictModel.findOne({
        name: district,
        stateId: state._id,
        isDeleted: false,
      });

      if (!exists) {
        await GeolocationDistrictModel.create({
          name: district,
          stateId: state._id,
        });
        console.log(`  ➕ District added: ${district}`);
      }
    }
  }

  await closeSeed();
  console.log("🎉 Geolocation seeding done");
}

seedGeolocation();
