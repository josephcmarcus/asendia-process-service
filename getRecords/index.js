const database = require('../database');

module.exports = async function (context) {
  const { instanceId } = context.bindingData.args;
  const data = {};

  try {
    const addressTable = process.env.DB_ADDRESS_TABLE;
    const itemTable = process.env.DB_ITEM_TABLE;

    const addresses = await database.getRecords(addressTable);
    const items = await database.getRecords(itemTable);

    context.log(
      `getRecords succeeded for ID = '${instanceId}'. Addresses received: ${addresses.length}. Items received: ${items.length}`
    );

    data.addresses = addresses;
    data.items = items;

    return data;
  } catch (err) {
    context.log(`getRecords failed for ID = '${instanceId}'. ${err}`);
    return null;
  }
};
