/**
 * @license
 * Copyright Entango Technologies. All Rights Reserved.
 */
import * as pubSub from "@google-cloud/pubsub";

/**
 * PubSub basic event
 *
 * @param {string} topic
 * @param {object} data
 * @param {object} attributes
 * @returns {Promise<void>}
 */
export default async (topic: string, data: object = {}, attributes: object = {}) => {
  let firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
  const ps = pubSub({
    projectId: firebaseConfig.projectId,
  });
  const message = JSON.stringify(data);
  const dataBuffer = Buffer.from(message);
  await ps.topic(topic).publisher().publish(dataBuffer, attributes);
};
