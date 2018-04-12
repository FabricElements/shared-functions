/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import pubSubEvent from "../../pubsub-event";
import * as types from "../helpers/types";

/**
 * Send messages to Slack
 *
 * @type {CloudFunction<Message>}
 */
export const message = functions.pubsub.topic("slack-message").onPublish(async (message) => {
  const attributes = message.attributes;
  const channelId = attributes.channel;
  if (!channelId) {
    console.error("channel attribute is missing");
    return;
  }
};


