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
const client_1 = require("@slack/client");
const functions = require("firebase-functions");
const config = functions.config();
const slackWebhook = config.slack && config.slack.webhook ? config.slack.webhook : null;
exports.default = functions.pubsub.topic("slack-message").onPublish((message) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (!slackWebhook) {
            throw new Error("slack token undefined");
        }
        const webhook = new client_1.IncomingWebhook(slackWebhook);
        const jsonObject = message.json;
        const text = jsonObject.text ? jsonObject.text : null;
        if (!text) {
            throw new Error("text undefined");
        }
        yield webhook.send(jsonObject);
    }
    catch (error) {
        console.error(error.message);
    }
    return null;
}));
//# sourceMappingURL=index.js.map