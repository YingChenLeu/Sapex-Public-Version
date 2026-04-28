# Sapex

## Firebase project migration (keep API + notifications intact)

This repo uses Firebase in two places:

- **Frontend**: Firebase Web SDK (Auth + Firestore + Callable Functions) in `src/lib/firebase.ts`
- **Backend (Firebase Functions)**: Cloud Functions v2 in `functions/src/index.ts`
  - **API**: `createStudyRoomMeet` (callable function)
  - **Notifications**: `notifyProblemCreatorOnNewMessage` (Firestore trigger that sends email via Resend)

### 1) Create a new Firebase project

In the Firebase console, create a new project and:

- Enable **Authentication** providers you use (e.g. Google)
- Create/enable **Firestore**

### 2) Configure the frontend for the new project

The frontend Firebase config is environment-driven via `VITE_FIREBASE_*`.

- Copy `.env.example` to `.env.local`
- Fill in values from Firebase Console → Project settings → Your apps → Web app config

### 3) Deploy Functions to the new project (API + notifications)

You must set these in the new project before deploying Functions:

- **Resend (email notifications)**:
  - `firebase functions:secrets:set RESEND_API_KEY`
  - `firebase functions:config:set` (or equivalent env) for:
    - `APP_PUBLIC_URL` (e.g. `https://yourapp.web.app` or your Vercel domain)
    - `RESEND_FROM`

- **Google Calendar / Meet (API)**:
  - Set `CALENDAR_CREDENTIALS_JSON` (service account JSON string)
  - Optionally set `CALENDAR_ID` (defaults to `primary`)

For local testing, copy `functions/.env.example` to `functions/.env`.

### 4) Data migration

If you need to keep existing users/data, export from the old project and import into the new project (Firestore data, Auth users, Storage if used). Then verify:

- Callable function `createStudyRoomMeet` returns expected payload
- Firestore trigger `notifyProblemCreatorOnNewMessage` sends emails on new messages
