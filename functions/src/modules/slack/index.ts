/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import {IncomingWebhook} from "@slack/client";
import * as functions from "firebase-functions";

const config = functions.config();
const slackWebhook = config.slack && config.slack.webhook ? config.slack.webhook : null;

export default functions.pubsub.topic("slack-message").onPublish(async (message) => {
  try {
    if (!slackWebhook) {
      throw new Error("slack token undefined");
    }
    const webhook = new IncomingWebhook(slackWebhook);
    const jsonObject = message.json;
    const text = jsonObject.text ? jsonObject.text : null;
    if (!text) {
      throw new Error("text undefined");
    }
    await webhook.send(jsonObject);
  } catch (error) {
    console.error(error.message);
  }
  return null;
});
