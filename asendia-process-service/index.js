const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    const activityPayload = {
        instanceId: context.df.instanceId,
        records: [],
        formattedRecords: [],
        errors: [],
    }

    const outputs = [];

    const records = yield context.df.callActivity('getRecords', activityPayload);
    if (records === null) {
        const message = `No records for ID = '${activityPayload.instanceId}'. An error occurred in the getRecords function.`;
        context.log(message);
        return message;
      } else if (records.addresses.length === 0) {
          const message = `No records to process for ID = '${activityPayload.instanceId}'. Exiting function.`;
          context.log(message);
          return message;
      };

    activityPayload.records = records;

    const formattedRecords = yield context.df.callActivity('formatRecords', activityPayload);

    activityPayload.formattedRecords = formattedRecords;

    // const results = yield context.df.callActivity('processRecords', activityPayload);

    outputs.push(formattedRecords);

    return outputs;
});