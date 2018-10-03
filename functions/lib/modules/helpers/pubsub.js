"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
const pubSub = require("@google-cloud/pubsub");
const ps = pubSub();
/**
 * PubSub basic event
 *
 * @param {string} topic
 * @param {object} data
 * @param {object} attributes
 * @returns {Promise<void>}
 */
exports.publish = async (topic, data = {}, attributes = {}) => {
    const message = JSON.stringify(data);
    const dataBuffer = Buffer.from(message);
    await ps.topic(topic, {}).publisher().publish(dataBuffer, attributes);
};
//# sourceMappingURL=pubsub.js.map