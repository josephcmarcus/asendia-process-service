const database = require('../database');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv').config();
const getDateTime = require('../utils/getDateTime');

const addressTable = process.env.DB_ADDRESS_TABLE;
const itemTable = process.env.DB_ITEM_TABLE;

module.exports = async function (context) {
  const { instanceId, formattedRecords } = context.bindingData.args;

  const results = {
    recordsReceived: formattedRecords.addresses.length,
    recordsProcessed: 0,
    errors: [],
  };

  for (record of formattedRecords.addresses) {
    try {
      console.log('test')

      try {
        // update the processed column in the mysql db with a timestamp
        const date = getDateTime();

        await database.updateRecord(
          addressTable,
          'processedDate',
          'packageID',
          [date, record.packageID]
        );
        context.log(
          `processRecords succeeded to update database for ${record.packageID} of instance = '${instanceId}'.`
        );
      } catch (err) {
        context.log(
          `processRecords failed to update database for ${record.packageID} of instance = '${instanceId}'. ${err}`
        );
      }

      results.recordsProcessed++;

    } catch (err) {
      const date = getDateTime();
      const error = {};
    }
    console.log(record.packageID);
  };

  context.log(
    `processRecords finished. Records received: ${results.recordsReceived}. Records processed: ${results.recordsProcessed}. Errors: ${results.errors.length}`
  );

  return results;

};