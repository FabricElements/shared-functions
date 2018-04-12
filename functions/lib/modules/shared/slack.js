"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
const functions = require("firebase-functions");
const rp = require("request-promise");
// Example:
// https://github.com/firebase/functions-samples/tree/9ce5109babd4f3b240d097debdc570dbe7383682/crashlytics-integration/slack-notifier
// Helper function that posts to Slack about the new issue
const notifySlack = (slackMessage) => {
    // See https://api.slack.com/docs/message-formatting on how
    // to customize the message payload
    return rp({
        body: {
            text: slackMessage,
        },
        json: true,
        method: "POST",
        uri: functions.config().slack.webhook_url,
    });
};
/**
 * Send messages to Slack
 *
 * @type {CloudFunction<Message>}
 */
exports.message = functions.pubsub.topic("slack-message").onPublish((message) => __awaiter(this, void 0, void 0, function* () {
    const attributes = message.attributes;
    const channelId = attributes.channel;
    if (!channelId) {
        console.error("channel attribute is missing");
        return;
    }
    message = "Test message";
    return notifySlack(message).then(() => {
        return console.log(`Message to channel ${channelId} successfully sent to Slack`);
    });
}));
//# sourceMappingURL=slack.js.map