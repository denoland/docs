---
title: "API server with Firebase"
oldUrl:
  - /deploy/docs/tutorial-firebase/
---

Firebase is a platform developed by Google for creating mobile and web
applications. In this tutorial we’ll build a small API using modern Deno and the
modular Firebase SDK that exposes endpoints to insert and retrieve information.

The Deno Deploy web application currently supports PostgreSQL and Deno KV as
databases. However, you can also use third-party databases and services like
Firebase.

Firebase expects a node-like environment, so we will need to start by adding the
`nodemodulesDir` option to our `deno.json` file, this will tell Deno to use a
`node_modules` directory:

```json title="deno.json"
"nodeModulesDir": auto
```

## Set up your Firebase project

Visit the [Firebase Console](https://console.firebase.google.com/), create a new
project, and add a web app to it. You will need the Firebase configuration
object to initialize your app, which you can find in the project settings.

## Create a .env file

Create a `.env` file in the root of your project and add your Firebase
configuration details. It should look something like this:

```env title=".env"
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Optional: use local emulators instead of production
# Set USE_FIREBASE_EMULATOR=true when running emulators
USE_FIREBASE_EMULATOR=false
# Host:port (no scheme) for Firestore emulator
FIRESTORE_EMULATOR_HOST=localhost:8080
# Host:port or full URL for Auth emulator
AUTH_EMULATOR_HOST=localhost:9099
```

## Enable anonymous authentication

For this tutorial, we will use Firebase Authentication with anonymous sign-in. 

To enable anonymous authentication, go to the Firebase Console, select your project, and navigate to the "Authentication" section (under the "Build" menu item). Click on the "Sign-in method" tab and enable "Anonymous" sign-in.

## Enable the Cloud Firestore API

To enable the Cloud Firestore API, go to the [Google Cloud Console](https://console.cloud.google.com/), select your project, and navigate to the "APIs & Services" section. Click on the "Library" tab and search for "Cloud Firestore API". Enable it for your project.

## Create a Firestore database

In the Firebase Console, navigate to the "Firestore Database" section (under the "Build" menu item). Click on the "Create database" button and follow the prompts to set up your Firestore database in production mode.

## Enable emulators (optional)

If you want to test your application locally without affecting your production
data, you can use the Firebase Local Emulator Suite. To do this, you need to
install the Firebase CLI:

```sh
npm install -g firebase-tools
```

Then, initialize the emulators in your project directory:

```sh
firebase init emulators
```

Next add the Firebase module to your project:

```sh
deno add npm:firebase --allow-scripts
```

Import the necessary functions from the Firebase modules and initialize your app
and services:

```ts title="main.ts"
import { initializeApp } from "firebase/app";
```
