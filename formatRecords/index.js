module.exports = async function (context) {
  const { instanceId, records } = context.bindingData.args;

  for (record of records.addresses) {
    const items = records.items.filter((item) => item.PackageID === record.PackageID);
    const itemPrices = [];

    for (item of items) {
      itemPrices.push(parseFloat(item.unitPrice));
      delete item.shippingCost;
      delete item.processedDate;
    }

    record.totalPackageValue = itemPrices.reduce((pre, curr) => pre + curr, 0)
    record.items = items;
    record.shippingCost = 0;
  }

  return records;
};