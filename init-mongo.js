conn = new Mongo();
db = conn.getDB(process.env.MONGO_INITDB_DATABASE);

db.createUser({
  user: process.env.MONGO_APP_USERNAME,
  pwd: process.env.MONGO_APP_PASSWORD,
  roles: [
    {
      role: "readWrite",
      db: process.env.MONGO_INITDB_DATABASE,
    }
  ]
});

db.vehicles.insertOne({vehicleId: process.env.VEHICLE_ID, name: process.env.VEHICLE_NAME});

db.missions.insertOne({missionId: process.env.MISSION_ID, name: process.env.MISSION_NAME});
