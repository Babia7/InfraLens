# Firebase setup for InfraLens

This guide sets up the Firebase side of InfraLens, including:
- Google sign-in auth
- Firestore rules and indexes
- Storage rules
- Local emulators
- Mandatory app-wide PIN lock

## 1) Create a Firebase project

1. Open [Firebase Console](https://console.firebase.google.com/).
2. Create a project (example: `infralens-dev`).
3. Add a **Web App** to the project.
4. Copy the web config values (apiKey, authDomain, projectId, appId, etc).

## 2) Enable sign-in provider

1. In Firebase Console, go to **Authentication > Sign-in method**.
2. Enable **Google** provider.
3. Add your authorized domain(s) for local and production usage.

## 3) Configure local app env vars

1. Copy `.env.example` to `.env.local`.
2. Set these values:

```bash
VITE_ENABLE_AUTH=true
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
```

When `VITE_ENABLE_AUTH=false`, InfraLens runs without auth gating.
InfraLens always requires PIN `19901991` before app access.

## 4) Point Firebase CLI to your project

Update `.firebaserc` and replace `infralens-dev` with your real project id.

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

## 5) Authenticate Firebase CLI

```bash
npm run firebase:login
```

## 6) Deploy rules and indexes

```bash
npm run firebase:rules:deploy
npm run firebase:indexes:deploy
```

## 7) (Optional) run emulators locally

```bash
npm run firebase:emulators
```

The Emulator UI will be available at `http://localhost:4000`.

## Included Firebase config files

- `firebase.json`
- `.firebaserc`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`

These are intentionally secure-by-default with explicit allow rules and global deny fallbacks.
