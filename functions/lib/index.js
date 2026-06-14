"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onNewSubscriber = exports.sendNewsletter = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const params_1 = require("firebase-functions/params");
admin.initializeApp();
const db = admin.firestore();
const brevoApiKey = (0, params_1.defineString)("BREVO_KEY");
function getBrevoClient() {
    const apiKeyValue = brevoApiKey.value();
    if (!apiKeyValue) {
        throw new functions.https.HttpsError("failed-precondition", "BREVO_KEY is missing. Set it before deploying.");
    }
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = apiKeyValue;
    return new SibApiV3Sdk.TransactionalEmailsApi();
}
const SENDER = {
    email: "ecdshelp@gmail.com",
    name: "DIB Foundation",
};
const SUBSCRIBERS_COLLECTION = "newsletterSubscriptions";
const CAMPAIGNS_COLLECTION = "newsletterCampaigns";
exports.sendNewsletter = functions.https.onCall(async (data, context) => {
    const campaignId = data.campaignId;
    if (!campaignId) {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with a campaignId.");
    }
    const campaignDoc = await db
        .collection(CAMPAIGNS_COLLECTION)
        .doc(campaignId)
        .get();
    const campaign = campaignDoc.data();
    if (!campaign) {
        throw new functions.https.HttpsError("not-found", "Campaign not found.");
    }
    const subject = campaign.subject;
    const content = campaign.content || campaign.body;
    if (!subject || !content) {
        throw new functions.https.HttpsError("failed-precondition", "Campaign must have subject and content.");
    }
    const subscribersSnapshot = await db
        .collection(SUBSCRIBERS_COLLECTION)
        .where("status", "==", "active")
        .get();
    const subscribers = subscribersSnapshot.docs
        .map((doc) => doc.data())
        .filter((subscriber) => subscriber.email);
    if (subscribers.length === 0) {
        throw new functions.https.HttpsError("failed-precondition", "No active subscribers found.");
    }
    const transactionalEmailsApi = getBrevoClient();
    try {
        const sendPromises = subscribers.map((subscriber) => {
            const unsubscribeUrl = `https://studio-8071626946-149cb.web.app/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
            const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
            sendSmtpEmail.to = [{ email: subscriber.email }];
            sendSmtpEmail.sender = SENDER;
            sendSmtpEmail.subject = subject;
            sendSmtpEmail.htmlContent = `
        ${content}

        <hr />
        <p style="font-size:12px;color:#666;">
          You are receiving this email because you subscribed to DIB Foundation updates.
          <br />
          <a href="${unsubscribeUrl}">Unsubscribe</a>
        </p>
      `;
            return transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        });
        await Promise.all(sendPromises);
        await db.collection(CAMPAIGNS_COLLECTION).doc(campaignId).update({
            status: "sent",
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            recipientCount: subscribers.length,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return {
            result: `Successfully sent newsletter to ${subscribers.length} subscribers.`,
        };
    }
    catch (error) {
        console.error("Error sending newsletter:", error);
        throw new functions.https.HttpsError("internal", "An error occurred while sending the newsletter.", error);
    }
});
exports.onNewSubscriber = functions.firestore
    .document(`${SUBSCRIBERS_COLLECTION}/{subscriberId}`)
    .onCreate(async (snap, context) => {
    const subscriber = snap.data();
    if (!subscriber) {
        console.log("No data associated with the event");
        return;
    }
    const email = subscriber.email;
    const status = subscriber.status;
    if (!email) {
        console.log("Subscriber document is missing email field");
        return;
    }
    if (status && status !== "active") {
        console.log(`Subscriber ${email} is not active. Welcome email skipped.`);
        return;
    }
    const transactionalEmailsApi = getBrevoClient();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.sender = SENDER;
    sendSmtpEmail.subject = "Welcome to the DIB Foundation Community!";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #123;">
        <h1>Welcome to the DIB Foundation Community!</h1>

        <p>Thank you for subscribing to DIB Foundation updates.</p>

        <p>
          We are excited to have you with us. You will now receive the latest
          news, stories, initiatives, and impact updates directly in your inbox.
        </p>

        <p>
          Through DIB Foundation, we are committed to advancing health equity,
          youth empowerment, mental health awareness, community wellbeing, and
          sustainable humanitarian impact.
        </p>

        <p>Warm regards,<br />The DIB Foundation Team</p>
      </div>
    `;
    try {
        await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
        console.log(`Welcome email sent to ${email}`);
    }
    catch (error) {
        console.error(`Error sending welcome email to ${email}:`, error);
    }
});
//# sourceMappingURL=index.js.map