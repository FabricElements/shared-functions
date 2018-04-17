/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as pubSub from "@google-cloud/pubsub";

const ps = pubSub();

/**
 * PubSub basic event
 *
 * @param {string} topic
 * @param {object} data
 * @param {object} attributes
 * @returns {Promise<void>}
 */
export const publish = async (topic: string, data: object = {}, attributes: object = {}) => {
  const message = JSON.stringify(data);
  const dataBuffer = Buffer.from(message);
  await ps.topic(topic, {}).publisher().publish(dataBuffer, attributes);
};
