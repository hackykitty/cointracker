const axios = require("axios");
const Address = require("../models/Address");
const SyncState = require("../models/SyncState");
const { PORT, LIMIT } = require("../constants");

const synchronizeAllAddresses = async () => {
  try {
    const addresses = await Address.find({});

    for (let addrDoc of addresses) {
      const address = addrDoc.address;
      let syncState = await SyncState.findOne({ address: address });

      if (!syncState) {
        syncState = new SyncState({ address, lastSyncedOffset: 0 });
        await syncState.save();
      }

      let continueSync = true;

      while (continueSync) {
        try {
          const syncResponse = await axios.post(
            `http://localhost:${PORT}/addresses/${address}/sync`,
            {},
            {
              params: {
                limit: LIMIT,
                offset: syncState.lastSyncedOffset,
              },
            }
          );

          if (syncResponse.data && syncResponse.data.synced) {
            const newOffset = syncState.lastSyncedOffset + LIMIT;
            console.log(
              `Synchronized transactions for address: ${address} up to offset: ${newOffset}`
            );
            syncState.lastSyncedOffset = newOffset;
            await syncState.save(); // Save updated offset
          } else {
            console.log(`Synchronization completed for address: ${address}`);
            continueSync = false; // Stop synchronization for this address
          }
        } catch (error) {
          console.error(`Failed to sync address ${address}: ${error.message}`);
          continueSync = false; // Stop trying for this address
        }
      }
    }
  } catch (err) {
    console.error("Error in synchronizeAllAddresses:", err.message);
  }
};

module.exports = synchronizeAllAddresses;
