module.exports = async function (context) {
  const { instanceId, records } = context.bindingData.args;

  // This function takes the package data received from the getRecords function and outputs
  // each into the proper format to be received by the Asendia API.

  for (record of records.addresses) {
    const items = records.items.filter((item) => item.PackageID === record.PackageID);
    const itemPrices = [];

    for (item of items) {
      itemPrices.push(parseFloat(item.unitPrice));
      delete item.shippingCost;
      delete item.processedDate;
      delete item.PackageID;
    }

    record.accountNumber = process.env.ASENDIA_ACCOUNT_NUMBER;
    record.processingLocation = process.env.ASENDIA_PROCESSING_LOCATION;
    record.totalPackageValue = itemPrices.reduce((pre, curr) => pre + curr, 0)
    record.items = items;
    record.shippingCost = 0;
    record.packageID = record.PackageID;
    delete record.processedDate;
    delete record.PackageID;
  }

  return records;
};