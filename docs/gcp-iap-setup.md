# GCP IAP + Google OAuth setup (Cloud Run)

This runbook configures InfraLens behind **Google Cloud IAP** and ensures only approved Google identities can reach the app.

## 1) Prerequisites

- A GCP project with billing enabled.
- Cloud Run service for InfraLens deployed.
- Org policy that permits IAP use.

## 2) Lock Cloud Run behind the load balancer

Require all traffic to come through the HTTPS Load Balancer (so IAP can enforce Google login):

```bash
gcloud run services update <SERVICE_NAME> \
  --region=<REGION> \
  --ingress=internal-and-cloud-load-balancing
```

InfraLens nginx now rejects requests that do not include the IAP identity header (`X-Goog-Authenticated-User-Email`), returning `401` for non-IAP requests.

## 3) Configure OAuth consent + client for IAP

1. In Google Cloud Console, open **APIs & Services > OAuth consent screen** and configure the app (internal/external as required).
2. Open **APIs & Services > Credentials** and create an OAuth client used by IAP.
3. Open **Security > Identity-Aware Proxy** and enable IAP for the Cloud Run backend service.
4. Attach the OAuth client to IAP when prompted.

## 4) Grant IAP access

Grant the IAP-secured Web App User role to the InfraLens admin:

- Principal: `user:tinurajan1@gmail.com`
- Role: `roles/iap.httpsResourceAccessor`

You can grant this in Console IAM, or with gcloud:

```bash
gcloud projects add-iam-policy-binding <PROJECT_ID> \
  --member="user:tinurajan1@gmail.com" \
  --role="roles/iap.httpsResourceAccessor"
```

## 5) Enforce approved Google users inside InfraLens

Set these environment variables in the InfraLens deployment:

```bash
VITE_ENABLE_AUTH=true
VITE_ALLOWED_GOOGLE_EMAILS=tinurajan1@gmail.com
```

- `VITE_ENABLE_AUTH=true` forces the in-app Google login screen.
- `VITE_ALLOWED_GOOGLE_EMAILS` restricts access to a comma-separated allowlist.
- If allowlist is empty, any successfully authenticated Google account is allowed.

## 6) Verify behavior

1. Open InfraLens URL in an incognito window.
2. Confirm IAP requires Google login before the app loads.
3. Confirm `tinurajan1@gmail.com` can pass IAP and app sign-in.
4. Confirm a non-allowlisted account gets rejected by the app with an approval error.
5. Confirm direct `run.app` URL access is blocked unless it is reached through IAP + load balancer.
