# Playgrounds

**Playgrounds** are an easy way to play around with Deno Deploy, and to create
small projects. Using playgrounds you can write code, run it, and see the output
fully inside the browser.

Playgrounds have the full power of Deno Deploy: they support all the same
features as a normal project, including environment variables, custom domains,
and logs.

Playgrounds are also just as performant as all other projects on Deno Deploy:
they make full use of our global network to run your code as close to users as
possible.

- [Creating a playground](#creating-a-playground)
- [Using the playground editor](#using-the-playground-editor)
- [Making a playground public](#making-a-playground-public)
- [Exporting a playground to GitHub](#exporting-a-playground-to-github)

## Creating a playground

To create a new playground press the **New Playground** button in the top right
corner of the [project overview page](https://dash.deno.com/projects).

This will create a new playground with a randomly generated name. You can change
this name in the project settings later.

## Using the playground editor

The playground editor is opened automatically when you create a new playground.
You can also open it by navigating to your project's overview page and clicking
the **Edit** button.

The editor consists of two main areas: the editor on the left, and the preview
panel on the right. The editor is where you write your code, and the preview
panel is where you can see the output of your code through a browser window.

There is also a logs panel underneath the editor panel on the left side. This
panel shows the console output of your code, and is useful for debugging your
code.

After editing your code, you need to save and deploy it so the preview on the
right updates. You can do this by clicking the **Save & Deploy** button in the
top right, by pressing <kbd>Ctrl</kbd> + <kbd>S</kbd>, or opening the command
palette with <kbd>F1</kbd> and selecting **Deploy: Save & Deploy**.

In the tool bar in the top right of the editor you can see the current
deployment status of your project while saving.

The preview panel on the right will refresh automatically every time you save
and deploy your code.

The language dropdown in the top right of the editor allows you to switch
between JavaScript, JSX, TypeScript, and TSX. The default selected language is
TSX which will work for most cases.

## Making a playground public

Playgrounds can be shared with other users by making them public. This means
that anyone can view the playground and its preview. Public playgrounds can not
be edited by anyone: they can still only be edited by you. Logs are also only
shown to you. Users have the option to fork a public playground to make a
private copy of it that they can edit.

To make a playground public, press the **Share** button in the top tool bar in
the editor. The URL to your playground will be copied to your clipboard
automatically.

You can also change the playground visibility from the playground settings page
in the Deno Deploy dashboard. This can be used to change the visibility of a
playground from public to private again.

## Exporting a playground to GitHub

Playgrounds can be exported to GitHub. This is useful if your project is
starting to outgrow the single file limit of the playground editor.

Doing this will create a new GitHub repository containing the playground code.
This project will be automatically turned into a git project that is linked to
this new GitHub repository. Environment variables and domains will be retained.

The new GitHub repository will be created in your personal account, and will be
set to private. You can change these settings later in the GitHub repository
settings.

After exporting a playground, you can no longer use the Deno Deploy playground
editor for this project. This is a one-way operation.

To export the playground visit the playground settings page in the Deno Deploy
dashboard or select **Deploy: Export to GitHub** from the command palette (press
<kbd>F1</kbd> in the editor).

Here you can enter a name for the new GitHub repository. This name will be used
to create the repository on GitHub. The repository must not already exist.

Press **Export** to export the playground to GitHub.
