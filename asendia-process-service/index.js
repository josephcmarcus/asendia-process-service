const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    const activityPayload = {
        instanceId: context.df.instanceId,
        data: [],
        errors: [],
    }

    const outputs = [];

    const data = yield context.df.callActivity('getData', activityPayload);

    activityPayload.data = data;

    outputs.push(data);

    return outputs;
});