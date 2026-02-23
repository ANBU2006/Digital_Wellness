const mongoose = require("../server/node_modules/mongoose");

const MONGO_URI = "mongodb://localhost:27017/digital_wellness";
const TEMP_PASSWORD = "Temp@12345";

async function run() {
  await mongoose.connect(MONGO_URI);
  const users = mongoose.connection.db.collection("users");

  const result = await users.updateMany(
    { password: /^\$2[aby]\$/ },
    { $set: { password: TEMP_PASSWORD } }
  );

  console.log(`matched=${result.matchedCount}, modified=${result.modifiedCount}`);
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
