module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);

    if (!names.includes('missions')) {
      await db.createCollection('missions');
      console.log('[+] Created missions collection');
    }

    const missionIndexes = await db.collection('missions').indexes();
    if (!missionIndexes.some(i => i.name === 'vehicleId_1')) {
      await db.collection('missions').dropIndex('vehicleId_1').catch(() => {});
      console.log('[-] Dropped missions.vehicleId index');
    }

    if (!names.includes('telemetry')) {
      await db.createCollection('telemetry');
      console.log('[+] Created telemetry collection');
    }

    const telemetryIndexes = await db.collection('telemetry').indexes();

    if (!telemetryIndexes.some(i => i.name === 'vehicleId_1')) {
      await db.collection('telemetry').createIndex({ vehicleId: 1 });
      console.log('[+] Created telemetry.vehicleId index');
    }

    if (!telemetryIndexes.some(i => i.name === 'location_2dsphere')) {
      await db.collection('telemetry').createIndex({ location: '2dsphere' }, { name: 'location_2dsphere' });
      console.log('[+] Created telemetry.location 2dsphere index');
    }
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection('missions').dropIndex('vehicleId_1').catch(() => {});
    console.log('[-] Dropped missions.vehicleId index');
    await db.collection('telemetry').dropIndex('vehicleId_1').catch(() => {});
    await db.collection('telemetry').dropIndex('location_2dsphere').catch(() => {});
    console.log('[-] Dropped telemetry indexes');
  }
};
