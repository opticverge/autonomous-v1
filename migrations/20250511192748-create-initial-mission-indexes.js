module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (!collectionNames.includes('vehicles')) {
      await db.createCollection('vehicles');
      console.log('[+] Created vehicles collection');
    }

    const vehicleIndexes = await db.collection('vehicles').indexes();
    const hasVehicleIdIndex = vehicleIndexes.some(i => i.name === 'vehicleId_1');
    if (!hasVehicleIdIndex) {
      await db.collection('vehicles').createIndex({ vehicleId: 1 }, { unique: true });
      console.log('[+] Created vehicles.vehicleId index');
    }
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection('vehicles').dropIndex('vehicleId_1').catch(() => {});
    console.log('[-] Dropped vehicles.vehicleId index');
  }
};
