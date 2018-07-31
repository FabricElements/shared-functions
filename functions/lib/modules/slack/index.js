"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
const client_1 = require("@slack/client");
const functions = require("firebase-functions");
const config = functions.config();
exports.default = functions.pubsub.topic("slack-message").onPublish(async (message) => {
    try {
        const slackWebhook = config.slack && config.slack.webhook ? config.slack.webhook : null;
        if (!slackWebhook) {
            throw new Error("slack.webhook undefined");
        }
        const webhook = new client_1.IncomingWebhook(slackWebhook);
        const jsonObject = message.json;
        const text = jsonObject.text ? jsonObject.text : null;
        if (!text) {
            throw new Error("text undefined");
        }
        await webhook.send(jsonObject);
    }
    catch (error) {
        console.error(error.message);
    }
    return null;
});
//# sourceMappingURL=index.js.map