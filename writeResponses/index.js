const database = require('../database');

module.exports = async function (context) {
  const { responses, instanceId } = context.bindingData.args;
  const responseValues = [];
  const table = process.env.DB_RESPONSE_TABLE;
  const columns = `InstanceID, PackageID, ResponseStatusCode, ResponseStatusMessage, Date`;

  for (response of responses) {
    responseValues.push(Object.values(response));
  }

  try {
    await database.writeResponses(table, columns, responseValues);
    context.log(`writeResponses succeeded to update database for instance = '${instanceId}'.`);
  } catch (err) {
    context.log(`writeResponses failed to update database for instance = '${instanceId}'. ${err}`);
  }
  
  return responseValues;
};
