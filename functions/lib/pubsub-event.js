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
 * Copyright Entango Technologies. All Rights Reserved.
 */
const pubSub = require("@google-cloud/pubsub");
/**
 * PubSub basic event
 *
 * @param {string} topic
 * @param {object} data
 * @param {object} attributes
 * @returns {Promise<void>}
 */
exports.default = (topic, data = {}, attributes = {}) => __awaiter(this, void 0, void 0, function* () {
    let firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    const ps = pubSub({
        projectId: firebaseConfig.projectId,
    });
    const message = JSON.stringify(data);
    const dataBuffer = Buffer.from(message);
    yield ps.topic(topic).publisher().publish(dataBuffer, attributes);
});
//# sourceMappingURL=pubsub-event.js.map