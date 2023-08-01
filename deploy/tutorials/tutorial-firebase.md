# API server with Firestore (Firebase)

Firebase is a platform developed by Google for creating mobile and web
applications. You can persist data on the platform using Firestore. In this
tutorial let's take a look at how we can use it to build a small API that has
endpoints to insert and retrieve information.

- [Overview](#overview)
- [Concepts](#concepts)
- [Setup Firebase](#setup-firebase)
- [Write the application](#write-the-application)
- [Deploy the application](#deploy-the-application)

## Overview

We are going to build an API with a single endpoint that accepts `GET` and
`POST` requests and returns a JSON payload of information:

```sh
# A GET request to the endpoint without any sub-path should return the details
# of all songs in the store:
GET /songs
# response
[
  {
    title: "Song Title",
    artist: "Someone",
    album: "Something",
    released: "1970",
    genres: "country rap",
  }
]

# A GET request to the endpoint with a sub-path to the title should return the
# details of the song based on its title.
GET /songs/Song%20Title # '%20' == space
# response
{
  title: "Song Title"
  artist: "Someone"
  album: "Something",
  released: "1970",
  genres: "country rap",
}

# A POST request to the endpoint should insert the song details.
POST /songs
# post request body
{
  title: "A New Title"
  artist: "Someone New"
  album: "Something New",
  released: "2020",
  genres: "country rap",
}
```

In this tutorial, we will be:

- Creating and setting up a
  [Firebase Project](https://console.firebase.google.com/).
- Using a text editor to create our application.
- Creating a [gist](https://gist.github.com/) to "host" our application.
- Deploying our application on [Deno Deploy](https://dash.deno.com/).
- Testing our application using [cURL](https://curl.se/).

## Concepts

There are a few concepts that help in understanding why we take a particular
approach in the rest of the tutorial, and can help in extending the application.
You can skip ahead to [Setup Firebase](#setup-firebase) if you want.

### Deploy is browser-like

Even though Deploy runs in the cloud, in many aspects the APIs it provides are
based on web standards. So when using Firebase, the Firebase APIs are more
compatible with the web than those that are designed for server run times. That
means we will be using the Firebase web libraries in this tutorial.

### Firebase uses XHR

Firebase uses a wrapper around Closure's
[WebChannel](https://google.github.io/closure-library/api/goog.net.WebChannel.html)
and WebChannel was originally built around
[`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).
While WebChannel supports the more modern `fetch()` API, current versions of
Firebase for the web do not uniformly instantiate WebChannel with `fetch()`
support, and instead use `XMLHttpRequest`.

While Deploy is browser-like, it does not support `XMLHttpRequest`.
`XMLHttpRequest` is a "legacy" browser API that has several limitations and
features that would be difficult to implement in Deploy, which means it is
unlikely that Deploy will ever implement that API.

So, in this tutorial we will be using a limited _polyfill_ that provides enough
of the `XMLHttpRequest` feature set to allow Firebase/WebChannel to communicate
with the server.

### Firebase auth

Firebase offers quite [a few options](https://firebase.google.com/docs/auth)
around authentication. In this tutorial we are going to be using email and
password authentication.

When a user is logged in, Firebase can persist that authentication. Because we
are using the web libraries for Firebase, persisting the authentication allows a
user to navigate away from a page and not need to re-log in when returning.
Firebase allows authentication to be persisted in local storage, session storage
or none.

In a Deploy context, it is a little different. A Deploy deployment will remain
"active" meaning that in-memory state will be present from request to request on
some requests, but under various conditions a new deployment can be started up
or shutdown. Currently, Deploy doesn't offer any persistence outside of
in-memory allocation. In addition it doesn't currently offer the global
`localStorage` or `sessionStorage`, which is what is used by Firebase to store
the authentication information.

In order to reduce the need to re-authenticate but also ensure that we can
support multiple-users with a single deployment, we are going to use a polyfill
that will allow us to provide a `localStorage` interface to Firebase, but store
the information as a cookie in the client.

## Setup Firebase

[Firebase](https://firebase.google.com/) is a feature rich platform. All the
details of Firebase administration are beyond the scope of this tutorial. We
will cover what it needed for this tutorial.

1. Create a new project under the
   [Firebase console](https://console.firebase.google.com/).
2. Add a web application to your project. Make note of the `firebaseConfig`
   provided in the setup wizard. It should look something like the below. We
   will use this later:

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

3. Under `Authentication` in the administration console for, you will want to
   enable the `Email/Password` sign-in method.
4. You will want to add a user and password under `Authentication` and then
   `Users` section, making note of the values used for later.
5. Add `Firestore Database` to your project. The console will allow you to setup
   in _production mode_ or _test mode_. It is up to you how you configure this,
   but _production mode_ will require you to setup further security rules.
6. Add a collection to the database named `songs`. This will require you to add
   at least one document. Just set the document with an _Auto ID_.

_Note_ depending on the status of your Google account, there maybe other setup
and administration steps that need to occur.

## Write the application

We want to create our application as a JavaScript file in our favorite editor.

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
Firebase, so we will use v8 in this tutorial:

```js
import firebase from "https://cdn.skypack.dev/firebase@8.7.0/app";
import "https://cdn.skypack.dev/firebase@8.7.0/auth";
import "https://cdn.skypack.dev/firebase@8.7.0/firestore";
```

We are also going to use [oak](https://deno.land/x/oak) as the middleware
framework for creating the APIs, including middleware that will take the
`localStorage` values and set them as client cookies:

```js
import {
  Application,
  Router,
  Status,
} from "https://deno.land/x/oak@v7.7.0/mod.ts";
import { virtualStorage } from "https://deno.land/x/virtualstorage@0.1.0/middleware.ts";
```

Now we need to setup our Firebase application. We will be getting the
configuration from environment variables we will setup later under the key
`FIREBASE_CONFIG` and get references to the parts of Firebase we are going to
use:

```js
const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));
const firebaseApp = firebase.initializeApp(firebaseConfig, "example");
const auth = firebase.auth(firebaseApp);
const db = firebase.firestore(firebaseApp);
```

We are also going to setup the application to handle signed in users per
request. So we will create a map of users that we have previously signed in in
this deployment. While in this tutorial we will only ever have one signed in
user, the code can easily be adapted to allow clients to sign-in individually:

```js
const users = new Map();
```

Let's create our middleware router and create three different middleware
handlers to support `GET` and `POST` of `/songs` and a `GET` of a specific song
on `/songs/{title}`:

```js
const router = new Router();

// Returns any songs in the collection
router.get("/songs", async (ctx) => {
  const querySnapshot = await db.collection("songs").get();
  ctx.response.body = querySnapshot.docs.map((doc) => doc.data());
  ctx.response.type = "json";
});

// Returns the first document that matches the title
router.get("/songs/:title", async (ctx) => {
  const { title } = ctx.params;
  const querySnapshot = await db.collection("songs").where("title", "==", title)
    .get();
  const song = querySnapshot.docs.map((doc) => doc.data())[0];
  if (!song) {
    ctx.response.status = 404;
    ctx.response.body = `The song titled "${ctx.params.title}" was not found.`;
    ctx.response.type = "text";
  } else {
    ctx.response.body = querySnapshot.docs.map((doc) => doc.data())[0];
    ctx.response.type = "json";
  }
});

function isSong(value) {
  return typeof value === "object" && value !== null && "title" in value;
}

// Removes any songs with the same title and adds the new song
router.post("/songs", async (ctx) => {
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.throw(Status.BadRequest, "Must be a JSON document");
  }
  const song = await body.value;
  if (!isSong(song)) {
    ctx.throw(Status.BadRequest, "Payload was not well formed");
  }
  const querySnapshot = await db
    .collection("songs")
    .where("title", "==", song.title)
    .get();
  await Promise.all(querySnapshot.docs.map((doc) => doc.ref.delete()));
  const songsRef = db.collection("songs");
  await songsRef.add(song);
  ctx.response.status = Status.NoContent;
});
```

Ok, we are almost done. We just need to create our middleware application, and
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

Now let's add our router to the middleware application and set the application
to listen on port 8000:

```js
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });
```

Now we have an application that should serve up our APIs.

## Create a Project in Deno Deploy

1. Go to [https://dash.deno.com/new](https://dash.deno.com/new) (Sign in with
   GitHub if you didn't already) and click on **+ Empty Project** under **Deploy
   from the command line**.
2. Now click on **Settings** button available on the project page.
3. Navigate to **Environment Variables** Section and add the following:

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

You would need to set the value of the string to this (noting that spacing and
new lines are not required):

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

## Deploy the application

Now let's deploy the application:

1. Go to https://gist.github.com/new and create a new gist, ensuring the
   filename of the gist ends with `.js`.

   > For convenience the whole application is hosted at
   > https://deno.com/examples/firebase.js. You can skip creating a gist if you
   > want to try the example without any modification, or click the link at the
   > bottom of the tutorial.

2. Copy the _Raw_ link of the saved gist.
3. In your project on `dash.deno.com`, click the **Deploy URL** button and enter
   the link to the raw gist in the URL field.
4. Click the **Deploy** button and copy one of the URLs displayed in the
   **Domains** section of the project panel.

Now let's take our API for a spin.

We can create a new song:

```sh
curl --request POST \
  --header "Content-Type: application/json" \
  --data '{"title": "Old Town Road", "artist": "Lil Nas X", "album": "7", "released": "2019", "genres": "Country rap, Pop"}' \
  --dump-header \
  - https://<project_name>.deno.dev/songs
```

And we can get all the songs in our collection:

```sh
curl https://<project_name>.deno.dev/songs
```

And we get specific information about a title we created:

```sh
curl https://<project_name>.deno.dev/songs/Old%20Town%20Road
```

---

[![Deploy this example](/deno-deploy-button.svg)](https://dash.deno.com/new?url=https://deno.com/examples/firebase.js&env=FIREBASE_USERNAME,FIREBASE_PASSWORD,FIREBASE_CONFIG)
