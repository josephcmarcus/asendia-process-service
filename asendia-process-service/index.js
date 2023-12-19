const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    const activityPayload = {
        instanceId: context.df.instanceId,
        records: [],
        errors: [],
    }

    const outputs = [];

    const records = yield context.df.callActivity('getRecords', activityPayload);
    if (records === null) {
        const message = `Could not get records for ID = '${activityPayload.instanceId}'. An error occurred in the getRecords function.`;
        context.log(message);
        return message;
      } else if (records.length === 0) {
          const message = `No records to process for ID = '${activityPayload.instanceId}'. Exiting function.`;
          context.log(message);
          return message;
      };

    activityPayload.data = records;

    outputs.push(records);

    return outputs;
});