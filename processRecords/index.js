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
    responses: []
  };

  for (record of formattedRecords.addresses) {

    console.log(record);

    // Attempt to send each record to the Asendia API for processing
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.ASENDIA_API_URL}`,
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
          'X-AsendiaOne-ApiKey': `${process.env.ASENDIA_API_KEY}`,
          'X-AsendiaOne-DataSource': `${process.env.ASENDIA_DATA_SOURCE}`
        },
        data: {
          accountNumber: `${process.env.ASENDIA_ACCOUNT_NUMBER}`,
          processingLocation: `${process.env.ASENDIA_PROCESSING_LOCATION}`,
          labelType: record.labelType,
          orderNumber: record.orderNumber,
          dispatchNumber: record.dispatchNumber,
          packageID: record.PackageID,
          returnFirstName: record.returnFirstName,
          returnLastName: record.returnLastName,
          returnAddressLine1: record.returnAddressLine1,
          returnAddressLine2: record.returnAddressLine2,
          returnAddressLine3: record.returnAddressLine3,
          returnCity: record.returnCity,
          returnProvince: record.returnProvince,
          returnPostalCode: record.returnPostalCode,
          returnCountryCode: record.returnCountryCode,
          returnPhone: record.returnPhone,
          returnEmail: record.returnEmail,
          recipientFirstName: record.recipientFirstName,
          recipientLastName: record.recipientLastName,
          recipientBusinessName: record.recipientBusinessName,
          recipientAddressLine1: record.recipientAddressLine1,
          recipientAddressLine2: record.recipientAddressLine2,
          recipientAddressLine3: record.recipientAddressLine3,
          recipientCity: record.recipientCity,
          recipientProvince: record.recipientProvince,
          recipientPostalCode: record.recipientPostalCode,
          recipientCountryCode: record.recipientCountryCode,
          recipientPhone: record.recipientPhone,
          recipientEmail: record.recipientEmail,
          totalPackageWeight: record.totalPackageWeight,
          weightUnit: record.weightUnit,
          totalPackageValue: record.totalPackageValue,
          currencyType: record.currencyType,
          productCode: record.productCode,
          contentType: record.contentType,
          packageContentDescription: record.packageContentDescription,
          items: record.items,
          shippingCost: record.shippingCost
        },
        auth: {
          username: `${process.env.ASENDIA_USERNAME}`,
          password: `${process.env.ASENDIA_PASSWORD}`,
        },
        params: {}
      });

      const date = getDateTime();

      const recordResponse = {
        InstanceID: instanceId,
        PackageID: record.PackageID,
        Response: JSON.stringify(response.data),
        Date: date,
      }

      results.responses.push(recordResponse);

      // Attempt to update the processed column on the address and item tables with timestamp
      try {
        const date = getDateTime();

        await database.updateRecord(
          addressTable,
          'processedDate',
          'PackageID',
          [date, record.PackageID]
        );

        await database.updateRecord(
          itemTable,
          'processedDate',
          'PackageID',
          [date, record.PackageID]
        );
        context.log(
          `processRecords succeeded to update database for ${record.PackageID} of instance = '${instanceId}'.`
        );
      } catch (err) {
        context.log(
          `processRecords failed to update database for ${record.PackageID} of instance = '${instanceId}'. ${err}`
        );
      }

      results.recordsProcessed++;

    } catch (err) {
      const date = getDateTime();
      const error = {
        InstanceId: instanceId,
        PackageID: record.PackageID,
        Error: err.message,
        Trace: err.stack,
        Date: date,
      }
      results.errors.push(error);
    }
  };

  context.log(
    `processRecords finished. Records received: ${results.recordsReceived}. Records processed: ${results.recordsProcessed}. Errors: ${results.errors.length}`
  );

  return results;

};