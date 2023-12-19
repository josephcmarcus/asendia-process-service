module.exports = async function (context) {
  const { instanceId, records } = context.bindingData.args;

  for (record of records.addresses) {
    const items = records.items.filter((item) => parseInt(item.PackageID) === record.packageID);
    const itemPrices = [];

    for (item of items) {
      itemPrices.push(parseFloat(item.unitPrice));
    }

    record.totalPackageValue = itemPrices.reduce((pre, curr) => pre + curr, 0)
    record.items = items;
  }

  return records;
};