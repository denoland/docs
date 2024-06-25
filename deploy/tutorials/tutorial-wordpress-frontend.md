---
title: "Use WordPress as a headless CMS"
---

WordPress is the most popular CMS in the world, but is difficult to use in a
"headless" form, i.e. with a custom frontend.

In this tutorial, we show how to use Fresh, a modern web framework built on
Deno, to create a frontend for headless WordPress.

## **Step 1:** Clone the Fresh WordPress theme

Fresh offers two ready-to-go themes, one for a blog and one for shopfront.

**Blog**

```console
git clone https://github.com/denoland/fresh-wordpress-themes.git
cd fresh-wordpress-themes/blog
deno task docker
```

**Shop**

```sh
git clone https://github.com/denoland/fresh-wordpress-themes.git
cd fresh-wordpress-themes/corporate
deno task docker
```

Note that Blog and Shop themes use different setups for WordPress server. Make
sure you run `deno task docker` command in the right directory.

## **Step 2:** Open another terminal in the same directory and run:

```sh
deno task start
```

## **Step 3:** Visit http://localhost:8000/

You can manage the contents of the site via the WordPress dashboard at
http://localhost/wp-admin (username: `user`, password: `password`).

## WordPress hosting options

There are a lot of options for hosting WordPress on the internet. Many cloud
providers
[have](https://aws.amazon.com/getting-sstarted/hands-on/launch-a-wordpress-website/)
[special](https://cloud.google.com/wordpress)
[guides](https://learn.microsoft.com/en-us/azure/app-service/quickstart-wordpress)
and
[templates](https://console.cloud.google.com/marketplace/product/click-to-deploy-images/wordpress)
dedicated to WordPress. There are also dedicated hosting services for WordPress,
such as [Bluehost](https://www.bluehost.com/),
[DreamHost](https://www.dreamhost.com/),
[SiteGround](https://www.siteground.com/), etc. You can choose which is the best
fit for your needs from these options.

There are also many resources on the internet about how to scale your WordPress
instances.
