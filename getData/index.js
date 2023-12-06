const database = require('../database')

module.exports = async function (context) {
    const { instanceId } = context.bindingData.args;
    const data = {
        addresses: [],
        items: [],
    };

    try {
        const addressTable = process.env.DB_ADDRESS_TABLE;
        const itemTable = process.env.DB_ITEM_TABLE;

        const addresses = await database.getData(addressTable);
        const items = await database.getData(itemTable);

        context.log(`getData succeeded for ID = '${instanceId}'. Addresses received: ${addresses.length}. Items received: ${items.length}`);
        
        // return addresses;
        
        data.addresses.push(addresses);
        data.items.push(items)

        return data;
    } catch (err) {
        context.log(`getData failed for ID = '${instanceId}'. ${err}`);
        return null;
    }


};