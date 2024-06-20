# Connect to Firebase

Firebase is a platform developed by Google for creating mobile and web
applications. Its features include authentication primitives for log in and a
NoSQL datastore, Firestore, that you can persist data to.

This tutorial covers how to connect to Firebase from an application deployed on
Deno Deploy.

You can find a more comprehensive tutorial that builds a sample application on
top of Firebase [here](../tutorials/tutorial-firebase).

## Get credentials from Firebase

> This tutorial assumes that you've already created a project in Firebase and
> added a web application to your project.

1. Navigate to your project in Firebase and click on **Project Settings**
2. Scroll down until you see a card with your app name, and a code sample that
   includes a `firebaseConfig`object. It should look something like the below.
   Keep this handy. We will use it later:

   ```js
   var firebaseConfig = {
     apiKey: "APIKEY",
     authDomain: "example-12345.firebaseapp.com",
     projectId: "example-12345",
     storageBucket: "example-12345.appspot.com",
     messagingSenderId: "1234567890",
     appId: "APPID",
   };
   ```

## Create a Project in Deno Deploy

1. Go to [https://dash.deno.com/new](https://dash.deno.com/new) (Sign in with
   GitHub if you didn't already) and click on **+ Empty Project** under **Deploy
   from the command line**.
2. Now click on the **Settings** button available on the project page.
3. Navigate to the **Environment Variables** section and add the following:

   <dl>
    <dt><code>FIREBASE_USERNAME</code></dt>
    <dd>The Firebase user (email address) that was added above.</dd>
    <dt><code>FIREBASE_PASSWORD</code></dt>
    <dd>The Firebase user password that was added above.</dd>
    <dt><code>FIREBASE_CONFIG</code></dt>
    <dd>The configuration of the Firebase application as a JSON string.</dd>
   </dl>

   The configuration needs to be a valid JSON string to be readable by the
   application. If the code snippet given when setting up looked like this:

   ```js
   var firebaseConfig = {
     apiKey: "APIKEY",
     authDomain: "example-12345.firebaseapp.com",
     projectId: "example-12345",
     storageBucket: "example-12345.appspot.com",
     messagingSenderId: "1234567890",
     appId: "APPID",
   };
   ```

   You would need to set the value of the string to this (noting that spacing
   and new lines are not required):

   ```json
   {
     "apiKey": "APIKEY",
     "authDomain": "example-12345.firebaseapp.com",
     "projectId": "example-12345",
     "storageBucket": "example-12345.appspot.com",
     "messagingSenderId": "1234567890",
     "appId": "APPID"
   }
   ```

## Write code that connects to Firebase

The first thing we will do is import the `XMLHttpRequest` polyfill that Firebase
needs to work under Deploy as well as a polyfill for `localStorage` to allow the
Firebase auth to persist logged in users:

```js
import "https://deno.land/x/xhr@0.1.1/mod.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
installGlobals();
```

> ℹ️ we are using the current version of packages at the time of the writing of
> this tutorial. They may not be up-to-date and you may want to double check
> current versions.

Because Deploy has a lot of the web standard APIs, it is best to use the web
libraries for Firebase under deploy. Currently v9 is in still in beta for
Firebase, so we will use v8:

```js
import firebase from "https://esm.sh/firebase@9.17.0/app";
import "https://esm.sh/firebase@9.17.0/auth";
import "https://esm.sh/firebase@9.17.0/firestore";
```

Now we need to setup our Firebase application. We will be getting the
configuration from the environment variables we set up previously and get
references to the parts of Firebase we are going to use:

```js
const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));
const firebaseApp = firebase.initializeApp(firebaseConfig, "example");
const auth = firebase.auth(firebaseApp);
const db = firebase.firestore(firebaseApp);
```

Ok, we are almost done. We just need to create our middleware application and
add the `localStorage` middleware we imported:

```js
const app = new Application();
app.use(virtualStorage());
```

And then we need to add middleware to authenticate the user. In this tutorial we
are simply grabbing the username and password from the environment variables we
will be setting up, but this could easily be adapted to redirect a user to a
sign-in page if they are not logged in:

```js
app.use(async (ctx, next) => {
  const signedInUid = ctx.cookies.get("LOGGED_IN_UID");
  const signedInUser = signedInUid != null ? users.get(signedInUid) : undefined;
  if (!signedInUid || !signedInUser || !auth.currentUser) {
    const creds = await auth.signInWithEmailAndPassword(
      Deno.env.get("FIREBASE_USERNAME"),
      Deno.env.get("FIREBASE_PASSWORD"),
    );
    const { user } = creds;
    if (user) {
      users.set(user.uid, user);
      ctx.cookies.set("LOGGED_IN_UID", user.uid);
    } else if (signedInUser && signedInUid.uid !== auth.currentUser?.uid) {
      await auth.updateCurrentUser(signedInUser);
    }
  }
  return next();
});
```

## Deploy the application to Deno Deploy

Once you have finished writing your application, you can deploy it on Deno
Deploy.

To do this, go back to your project page at
`https://dash.deno.com/projects/<project-name>`.

You should see a couple of options to deploy:

- [Github integration](ci_github)
- [`deployctl`](./deployctl.md)
  ```sh
  deployctl deploy --project=<project-name> <application-file-name>
  ```

Unless you want to add a build step, we recommend that you select the Github
integration.

For more details on the different ways to deploy on Deno Deploy and the
different configuration options, read [here](how-to-deploy).
