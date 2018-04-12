/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */
import * as functions from "firebase-functions";
import * as rp from "request-promise";

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
export const message = functions.pubsub.topic("slack-message").onPublish(async (message) => {
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
});
