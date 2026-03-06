# Multi-Product-Viewer — Backend Setup and Run Guide

This README explains how to set up, configure, run, and verify the backend service that exposes a registration endpoint using Express, express-validator, and Firebase Admin SDK.

Key source files:
- Controller: [backend/controllers/UserController.js](Multi-Product-Viewer-v1/backend/controllers/UserController.js)

- Routes: [backend/routes/userRoutes.js](Multi-Product-Viewer-v1/backend/routes/userRoutes.js)
- Validation middleware: [backend/middleware/validate.js](Multi-Product-Viewer-v1/backend/middleware/validate.js)
- Validators: [backend/validators/userValidator.js](Multi-Product-Viewer-v1/backend/validators/userValidator.js)

## 1) Prerequisites

- Node.js LTS (v18 or newer) and npm
  node -v
  npm -v

- A Firebase project with a Service Account (JSON) for Admin SDK.

Security note:
- Use environment variables or secure secret managers.

## 2) Clone and install dependencies

Install Node dependencies (based on your project layout):
- If package.json lives under backend/, run:
    cd backend
    npm install

- If package.json is at the repo root, run:
    npm install


## 3) Configure environment (Firebase Admin)

Code imports a Firebase Admin initializer from the backend/config directory. Provide credentials in one of the standard ways below. Pick exactly one approach:

Use environment variables
- If your initializer supports direct env vars (e.g., FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY), set them before starting the app.
    ```bash
    # macOS/Linux example (quotes preserve newlines in private keys)
    export FIREBASE_PROJECT_ID="your-project-id"
    export FIREBASE_CLIENT_EMAIL="firebase-adminsdk-abc@your-project-id.iam.gserviceaccount.com"
    export FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your key...\n-----END PRIVATE KEY-----\n"
    ```

Important:
- Ensure your Firebase Admin init uses the same mechanism you choose above.
- Keep private keys properly escaped if provided via env vars (newline characters as \n).


## 4) Start the server

From the directory containing your Node project (root or backend/, depending on your package.json location):

Preferred (if a start script exists):
  npm start

Fallback (if no script is defined), use your app’s entry file (e.g., app.js, server.js, or index.js):
  node app.js

The server port depends on your app configuration (commonly 3000). Watch the console logs for the actual port.


## 6) Project structure (relevant parts)

  Multi-Product-Viewer-v1/
  └── backend/
      ├── controllers/
      │   └── UserController.js
      ├── routes/
      │   └── userRoutes.js
      ├── validators/
      │   └── userValidator.js
      ├── middleware/
      │   └── validate.js
      └── config/
          └── (Firebase Admin initializer lives here)
