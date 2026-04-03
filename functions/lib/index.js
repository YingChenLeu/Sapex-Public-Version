"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyProblemCreatorOnNewMessage = exports.createStudyRoomMeet = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
const firestore_2 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const firebase_functions_1 = require("firebase-functions");
const params_1 = require("firebase-functions/params");
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)();
}
const CALENDAR_ID_ENV = "CALENDAR_ID";
const CREDENTIALS_ENV = "CALENDAR_CREDENTIALS_JSON";
const resendApiKey = (0, params_1.defineSecret)("RESEND_API_KEY");
const appPublicUrl = (0, params_1.defineString)("APP_PUBLIC_URL", {
    default: "",
    description: "Public origin for email links, e.g. https://yourapp.web.app (no trailing slash)",
});
const resendFrom = (0, params_1.defineString)("RESEND_FROM", {
    default: "Sapex <onboarding@resend.dev>",
    description: "Verified sender in Resend (From:)",
});
const TEN_MIN_MS = 10 * 60 * 1000;
function getCalendarId() {
    const id = process.env[CALENDAR_ID_ENV];
    return id && id.trim() ? id.trim() : "primary";
}
function getCredentials() {
    const raw = process.env[CREDENTIALS_ENV];
    if (!raw || !raw.trim()) {
        throw new https_1.HttpsError("failed-precondition", "Calendar API credentials not configured. Set CALENDAR_CREDENTIALS_JSON (service account JSON string) and CALENDAR_ID in Firebase config or environment.");
    }
    try {
        const parsed = JSON.parse(raw);
        if (!parsed.client_email || !parsed.private_key) {
            throw new Error("Missing client_email or private_key in credentials JSON");
        }
        return { client_email: parsed.client_email, private_key: parsed.private_key };
    }
    catch (e) {
        throw new https_1.HttpsError("invalid-argument", "CALENDAR_CREDENTIALS_JSON is invalid JSON or missing client_email/private_key.");
    }
}
async function createCalendarEventWithMeet(subjectName, calendarId, credentials) {
    const auth = new google_auth_library_1.JWT({
        email: credentials.client_email,
        key: credentials.private_key.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/calendar"],
    });
    const calendar = googleapis_1.google.calendar({ version: "v3", auth });
    const now = new Date();
    const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const event = {
        summary: subjectName,
        description: "Study room created via Sapex",
        start: {
            dateTime: now.toISOString(),
            timeZone: "UTC",
        },
        end: {
            dateTime: end.toISOString(),
            timeZone: "UTC",
        },
        conferenceData: {
            createRequest: {
                requestId: `sapex-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
                conferenceSolutionKey: {
                    type: "hangoutsMeet",
                },
            },
        },
    };
    const res = await calendar.events.insert({
        calendarId,
        requestBody: event,
        conferenceDataVersion: 1,
    });
    const data = res.data;
    const hangoutLink = data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ??
        data.hangoutLink ??
        "";
    if (!hangoutLink) {
        throw new https_1.HttpsError("internal", "Calendar API did not return a Meet link. Ensure the calendar is eligible for Google Meet (e.g. Google Workspace or primary calendar with Meet enabled).");
    }
    return { hangoutLink, id: data.id ?? undefined };
}
exports.createStudyRoomMeet = (0, https_1.onCall)({ region: "us-central1" }, async (request) => {
    if (!request.auth?.uid) {
        throw new https_1.HttpsError("unauthenticated", "You must be signed in to create a study room.");
    }
    const { subjectName } = request.data ?? {};
    if (!subjectName || typeof subjectName !== "string" || !subjectName.trim()) {
        throw new https_1.HttpsError("invalid-argument", "subjectName is required and must be a non-empty string.");
    }
    const calendarId = getCalendarId();
    const credentials = getCredentials();
    try {
        const { hangoutLink, id } = await createCalendarEventWithMeet(subjectName.trim(), calendarId, credentials);
        return { meetLink: hangoutLink, eventId: id };
    }
    catch (err) {
        if (err instanceof https_1.HttpsError)
            throw err;
        console.error("createStudyRoomMeet error:", err);
        throw new https_1.HttpsError("internal", err instanceof Error ? err.message : "Failed to create Google Meet link.");
    }
});
function buildOfflineMessageEmailHtml(opts) {
    const { senderName, title, problemLink, logoUrl } = opts;
    const safeSender = escapeHtml(senderName);
    const safeTitle = escapeHtml(title);
    const ctaHref = problemLink ? escapeHtml(problemLink) : "";
    const safeLogo = logoUrl ? escapeHtml(logoUrl) : null;
    const logoBlock = safeLogo
        ? `<img src="${safeLogo}" alt="Sapex" width="140" height="auto" style="display:block;max-width:140px;height:auto;margin:0 auto 20px;border:0;outline:none;text-decoration:none;" />`
        : `<div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#7cdbbd;letter-spacing:-0.02em;margin:0 0 16px;">Sapex</div>`;
    const ctaBlock = problemLink
        ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:28px auto 0;">
        <tr>
          <td style="border-radius:10px;background:#7cdbbd;">
            <a href="${ctaHref}" style="display:inline-block;padding:14px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;color:#0a0d17;text-decoration:none;border-radius:10px;">Open thread in Academic Center</a>
          </td>
        </tr>
      </table>`
        : `<p style="margin:24px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#5c6570;">Open Sapex and go to <strong style="color:#0f1419;">Academic Center</strong> to view the conversation.</p>`;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New message</title>
</head>
<body style="margin:0;padding:0;background:#eef1f6;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safeSender} messaged you about “${safeTitle}”</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef1f6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,20,25,0.08);">
          <tr>
            <td style="padding:28px 32px 20px;background:linear-gradient(145deg,#12161f 0%,#1a2230 100%);text-align:center;">
              ${logoBlock}
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#8b95a8;">Academic Center</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 36px;">
              <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:18px;font-weight:600;color:#0f1419;line-height:1.35;">You have a new message</p>
              <p style="margin:0 0 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#3d4654;">
                <strong style="color:#0f1419;">${safeSender}</strong> replied on your post
                <strong style="color:#0f1419;">“${safeTitle}”</strong>.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f8fb;border-radius:12px;border:1px solid #e8ecf2;">
                <tr>
                  <td style="padding:16px 18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;color:#5c6570;">
                    You’re receiving this because you’re the author of this problem and weren’t active in the chat when the message arrived. Replies are limited to once every 10 minutes per thread.
                  </td>
                </tr>
              </table>
              ${ctaBlock}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #eef1f6;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#8b95a8;text-align:center;">
                Sent by Sapex · Peer academic help
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
async function sendResendEmail(apiKey, from, to, subject, html) {
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to: [to],
            subject,
            html,
        }),
    });
    if (!res.ok) {
        const text = await res.text();
        firebase_functions_1.logger.error("Resend API error", { status: res.status, body: text });
        throw new Error(`Resend failed: ${res.status}`);
    }
}
exports.notifyProblemCreatorOnNewMessage = (0, firestore_2.onDocumentCreated)({
    document: "problems/{problemId}/messages/{messageId}",
    region: "us-central1",
    secrets: [resendApiKey],
}, async (event) => {
    const snap = event.data;
    if (!snap)
        return;
    const problemId = event.params.problemId;
    const data = snap.data();
    const senderUid = data.user?.uid;
    if (!senderUid) {
        firebase_functions_1.logger.warn("notifyProblemCreatorOnNewMessage: message without user.uid", { problemId });
        return;
    }
    const db = (0, firestore_1.getFirestore)();
    const problemRef = db.collection("problems").doc(problemId);
    const problemSnap = await problemRef.get();
    if (!problemSnap.exists)
        return;
    const problem = problemSnap.data();
    const creatorUid = problem.user?.uid;
    if (!creatorUid)
        return;
    if (senderUid === creatorUid)
        return;
    const activeSnap = await problemRef.collection("activeUsers").doc(creatorUid).get();
    if (activeSnap.exists)
        return;
    const rateOk = await db.runTransaction(async (t) => {
        const p = await t.get(problemRef);
        const pdata = p.data();
        const last = pdata?.lastOfflineNotifyAt;
        if (last) {
            const elapsed = Date.now() - last.toMillis();
            if (elapsed < TEN_MIN_MS)
                return false;
        }
        t.update(problemRef, { lastOfflineNotifyAt: firestore_1.FieldValue.serverTimestamp() });
        return true;
    });
    if (!rateOk)
        return;
    let creatorEmail;
    try {
        const userRecord = await (0, auth_1.getAuth)().getUser(creatorUid);
        creatorEmail = userRecord.email ?? "";
    }
    catch (e) {
        firebase_functions_1.logger.error("notifyProblemCreatorOnNewMessage: getUser failed", { creatorUid, e });
        return;
    }
    if (!creatorEmail) {
        firebase_functions_1.logger.warn("notifyProblemCreatorOnNewMessage: no email for creator", { creatorUid });
        return;
    }
    const apiKey = resendApiKey.value();
    if (!apiKey?.trim()) {
        firebase_functions_1.logger.error("RESEND_API_KEY secret is empty");
        return;
    }
    const base = appPublicUrl.value().trim().replace(/\/$/, "");
    const senderName = data.user?.name || "Someone";
    const title = problem.title || "your problem";
    const problemLink = base
        ? `${base}/helpboard?problem=${encodeURIComponent(problemId)}`
        : null;
    const logoUrl = base ? `${base}/simple-logo.png` : null;
    const html = buildOfflineMessageEmailHtml({
        senderName,
        title,
        problemLink,
        logoUrl,
    });
    try {
        await sendResendEmail(apiKey, resendFrom.value(), creatorEmail, `New message on “${title}” — Sapex`, html);
        firebase_functions_1.logger.info("notifyProblemCreatorOnNewMessage: email sent", { problemId, creatorUid });
    }
    catch (e) {
        firebase_functions_1.logger.error("notifyProblemCreatorOnNewMessage: send failed", { problemId, e });
    }
});
function escapeHtml(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
//# sourceMappingURL=index.js.map