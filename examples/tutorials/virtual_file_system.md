---
title: "Build a Browser-Based Virtual File System"
description: "Learn how to create an in-browser virtual file system and code editor using URL.createObjectURL. This step-by-step tutorial guides you through building a web application that lets you create, edit, and preview files without server-side storage."
url: /examples/virtual_file_system_tutorial/
---

In this tutorial, we'll build a browser-based code editor with a virtual file
system that allows users to create, edit, and preview files directly in the
browser without any server-side storage.

The key to our implementation is the `URL.createObjectURL()` browser API, which
lets us generate URLs for data that exists only in memory. This powerful feature
enables us to build sophisticated applications that work with files entirely
within the browser.

![Screenshot of the virtual file system we'll build](/examples/tutorials/images/virtual_file_system_tutorial.png)

## What we'll build

We'll create a web application with:

1. A sidebar listing virtual files
2. A text editor for modifying file content
3. A live preview panel for HTML files
4. The ability to create new files
5. A download option for exporting all files

## Set up the project structure

Let's start by creating a new file called `virtual_file_system.ts`. In this file
we'll build out a virtual file system and serve the application using Deno's
built-in server. For now, create an empty string to hold the HTML content and a
simple Deno server:

```ts
const html = ``;

console.log("Starting server at http://localhost:8000");
await Deno.serve((req) => {
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}, { port: 8000 });
```

## Create the HTML structure

Next, let's build the basic HTML structure of our application. Assign the
following HTML to the `html` const:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Virtual File System with URL.createObjectURL</title>
    <style>
      /* We'll add CSS styles here */
    </style>
  </head>
  <body>
    <header>
      <h2>Virtual File System Demo</h2>
      <div>
        <button id="downloadAllBtn">Download All Files</button>
      </div>
    </header>

    <div class="sidebar">
      <h3>Files</h3>
      <ul class="file-list" id="fileList"></ul>

      <div class="file-actions">
        <button id="newFileBtn">New File</button>
        <button id="newFolderBtn">New Folder</button>
      </div>
    </div>

    <div class="content">
      <div class="editor">
        <div class="section-header">
          <div id="currentFile">Select a file to edit</div>
          <button class="small" id="saveBtn">Save</button>
        </div>
        <textarea id="editor"></textarea>
      </div>

      <div class="preview">
        <div class="section-header">
          <div>Preview</div>
          <button class="small" id="refreshBtn">Refresh</button>
        </div>
        <iframe id="preview"></iframe>
      </div>
    </div>

    <script>
      // We'll add JavaScript code here
    </script>
  </body>
</html>
```

This HTML structure defines the application layout. With a header, sidebar, and
content area. The content area is further divided into an editor and a preview
section.

## Add styling with CSS

Let's style our application to make it more user friendly. Add the following CSS
inside the `<style>` tag in your HTML:

```css
body {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 50px 1fr;
  height: 100vh;
  grid-template-areas:
    "header header"
    "sidebar content";
}

header {
  grid-area: header;
  background: #333;
  color: white;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar {
  grid-area: sidebar;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  padding: 10px;
  overflow: auto;
}

.content {
  grid-area: content;
  display: grid;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
}

.editor {
  border-bottom: 1px solid #ddd;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 2px;
}

.file-item:hover {
  background: #e9e9e9;
}

.file-item.active {
  background: #ddd;
  font-weight: bold;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

button.small {
  font-size: 12px;
  padding: 3px 8px;
}

textarea {
  flex-grow: 1;
  resize: none;
  padding: 10px;
  border: none;
  outline: none;
  font-family: monospace;
  font-size: 14px;
}

iframe {
  flex-grow: 1;
  border: none;
  background: white;
}

.file-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
```

The CSS uses CSS Grid to create a layout with a header, sidebar, and content
area. The content area is further divided into an editor and a preview section.

## Implement the Virtual File System

Now let's create the core of our application - the `VirtualFileSystem` class
that will manage our in-memory files. Add the following inside the `<script>`
tags in the HTML:

```ts
class VirtualFileSystem {
  constructor() {
    // Initialize with some sample files
    this.files = {
      "index.html":
        '<!DOCTYPE html>\\n<html>\\n<head>\\n  <title>My Page</title>\\n  <link rel="stylesheet" href="styles.css">\\n</head>\\n<body>\\n  <h1>Welcome to my page!</h1>\\n  <p>This is a simple web page created in the virtual file system.</p>\\n  <script src="script.js"><\\/script>\\n</body>\\n</html>',
      "styles.css":
        "body {\\n  font-family: Arial, sans-serif;\\n  margin: 0;\\n  padding: 20px;\\n  line-height: 1.6;\\n  color: #333;\\n}\\n\\nh1 {\\n  color: #4CAF50;\\n}",
      "script.js":
        'console.log("Hello from the virtual file system!");\\n\\n// Add a click event to the document\\ndocument.addEventListener("click", function() {\\n  alert("You clicked on the document!");\\n});',
    };
    this.activeFile = null;
    this.objectUrls = {};
  }

  // Get a list of all files
  getFiles() {
    return Object.keys(this.files);
  }

  // Get the content of a file
  getFileContent(filename) {
    return this.files[filename] || "";
  }

  // Save content to a file
  saveFile(filename, content) {
    this.files[filename] = content;

    // If we have an objectURL for this file, revoke it and create a new one
    if (this.objectUrls[filename]) {
      URL.revokeObjectURL(this.objectUrls[filename]);
      delete this.objectUrls[filename];
    }
  }

  // Create a new file
  createFile(filename, content = "") {
    if (!this.files[filename]) {
      this.files[filename] = content;
      return true;
    }
    return false;
  }

  // Delete a file
  deleteFile(filename) {
    if (this.files[filename]) {
      if (this.objectUrls[filename]) {
        URL.revokeObjectURL(this.objectUrls[filename]);
        delete this.objectUrls[filename];
      }
      delete this.files[filename];
      return true;
    }
    return false;
  }

  // Get an object URL for a file (creates if it doesn't exist)
  getObjectURL(filename) {
    if (!this.files[filename]) return null;

    if (!this.objectUrls[filename]) {
      // Determine MIME type based on extension
      const extension = filename.split(".").pop().toLowerCase();
      let mimeType;

      switch (extension) {
        case "html":
          mimeType = "text/html";
          break;
        case "css":
          mimeType = "text/css";
          break;
        case "js":
          mimeType = "text/javascript";
          break;
        case "json":
          mimeType = "application/json";
          break;
        case "png":
          mimeType = "image/png";
          break;
        case "jpg":
        case "jpeg":
          mimeType = "image/jpeg";
          break;
        default:
          mimeType = "text/plain";
      }

      const blob = new Blob([this.files[filename]], { type: mimeType });
      this.objectUrls[filename] = URL.createObjectURL(blob);
    }

    return this.objectUrls[filename];
  }

  // Create a zip archive of all files
  async createArchive() {
    // This would normally use a library like JSZip
    // For this demo, we'll just create a JSON representation
    const blob = new Blob([JSON.stringify(this.files, null, 2)], {
      type: "application/json",
    });
    return URL.createObjectURL(blob);
  }
}
```

The constuctor initializes the file system with some sample files (index.html,
styles.css, and script.js).

We then provide methods for:

### File Operations

- `getFiles()`: Returns a list of all file names
- `getFileContent()`: Returns the content of a specific file
- `saveFile()`: Updates the content of a file and revokes any existing object
  URL
- `createFile()`: Creates a new file if it doesn't already exist
- `deleteFile()`: Removes a file and revokes its object URL

### Object URL Management

- `getObjectURL()`: Creates or retrieves an object URL for a file
- `createArchive()`: Creates an object URL for a JSON representation of all
  files

The most important method here is `getObjectURL()`, which:

1. Determines the correct MIME type based on the file extension
2. Creates a Blob containing the file content with the appropriate MIME type
3. Generates an object URL for that Blob
4. Caches the URL to avoid creating duplicate URLs

## Add UI Interaction Code

Now let's add the UI code that will interact with our virtual file system,
beneath the `VirtualFileSystem` class, still inside the script tags add the
following js code:

```ts
// Initialize the virtual file system
const fs = new VirtualFileSystem();

// DOM elements
const fileList = document.getElementById("fileList");
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const currentFile = document.getElementById("currentFile");
const saveBtn = document.getElementById("saveBtn");
const refreshBtn = document.getElementById("refreshBtn");
const newFileBtn = document.getElementById("newFileBtn");
const newFolderBtn = document.getElementById("newFolderBtn");
const downloadAllBtn = document.getElementById("downloadAllBtn");

// Initialize the file list
function updateFileList() {
  fileList.innerHTML = "";

  fs.getFiles().forEach((filename) => {
    const li = document.createElement("li");
    li.className = "file-item";
    if (fs.activeFile === filename) {
      li.classList.add("active");
    }
    li.textContent = filename;

    li.addEventListener("click", () => {
      openFile(filename);
    });

    fileList.appendChild(li);
  });
}

// Open a file in the editor
function openFile(filename) {
  fs.activeFile = filename;
  const content = fs.getFileContent(filename);
  editor.value = content;
  currentFile.textContent = filename;
  updateFileList();

  // If it's an HTML file, update the preview
  if (filename.endsWith(".html")) {
    updatePreview();
  }
}

// Save the current file
function saveCurrentFile() {
  if (!fs.activeFile) return;
  fs.saveFile(fs.activeFile, editor.value);

  // If it's an HTML file, update the preview
  if (fs.activeFile.endsWith(".html")) {
    updatePreview();
  }
}

// Update the preview iframe
function updatePreview() {
  if (!fs.activeFile) return;

  const previewDoc = preview.contentDocument || preview.contentWindow.document;

  // If we're editing an HTML file, use it directly
  if (fs.activeFile.endsWith(".html")) {
    const url = fs.getObjectURL(fs.activeFile);
    preview.src = url;
  } else {
    // For non-HTML files, show their content in a basic HTML page
    previewDoc.open();
    previewDoc.write(
      '<pre style="white-space: pre-wrap; word-wrap: break-word; padding: 10px;">' +
        editor.value.replace(/&/g, "&amp;").replace(/</ / g, "&lt;").replace(
          />/g,
          "&gt;",
        ) +
        "</pre>",
    );
    previewDoc.close();
  }
}

// Create a new file
function createNewFile() {
  const filename = prompt("Enter file name:");
  if (!filename) return;

  if (fs.createFile(filename)) {
    updateFileList();
    openFile(filename);
  } else {
    alert("A file with that name already exists!");
  }
}

// Download all files as a single JSON archive
async function downloadAllFiles() {
  const url = await fs.createArchive();
  const link = document.createElement("a");
  link.href = url;
  link.download = "virtual_files.json";
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

// Event listeners
saveBtn.addEventListener("click", saveCurrentFile);
refreshBtn.addEventListener("click", updatePreview);
newFileBtn.addEventListener("click", createNewFile);
downloadAllBtn.addEventListener("click", downloadAllFiles);

// Initialize the UI
updateFileList();
if (fs.getFiles().includes("index.html")) {
  openFile("index.html");
}
```

This UI code connects the virtual file system with the user interface. First it
gets references to all the interactive elements in the UI, then it initializes
the file list and opens the index.html file if it exists.

- `updateFileList()` Populates the sidebar with file names
- `openFile()` Loads a file into the editor and updates the UI
- `saveCurrentFile()` Saves the editor content to the active file
- `updatePreview()` Updates the preview iframe using object URLs
- `createNewFile()` Prompts the user for a filename and creates a new file
- `downloadAllFiles()` Creates a downloadable JSON archive of all files

Finally, we attach event listeners to the UI buttons and initialize the file
list

Note how the `updatePreview()` function uses `URL.createObjectURL()` differently
depending on the file type:

- For HTML files, it sets the iframe's `src` attribute to the object URL
- For other files, it displays the content in a formatted `<pre>` element

## Testing the Application

Let's run our application and test it out:

```bash
deno run --allow-net virtual_file_system.ts
```

Then open your browser and navigate to `http://localhost:8000`. You should see a
fully functional in-browser code editor with:

1. Three sample files in the sidebar: index.html, styles.css, and script.js
2. The ability to edit these files in the editor
3. A live preview of the HTML file
4. The ability to create new files
5. An option to download all files as a JSON archive

## How URL.createObjectURL Works

The key to our virtual file system is the
[`URL.createObjectURL()`](/api/web/~/URL.createObjectURL) method. This browser
API creates a URL that represents an object stored in memory. The URL has the
format `blob:http://localhost:8000/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

When you use this URL (for example, in the `src` attribute of an iframe), the
browser fetches the content from memory instead of making a network request.
This allows us to create virtual files, generate dynamic content and handle
different file types.

It's important to note that object URLs consume memory until they're explicitly
revoked with [`URL.revokeObjectURL()`](/api/web/~/URL.revokeObjectURL) or the
page is unloaded.

Our application properly manages this by:

1. Revoking URLs when files are saved with new content
2. Revoking URLs when files are deleted
3. Revoking download URLs after the download has started

## Building on the project

Now that you have a basic virtual file system working, here are some ways you
could enhance it:

**Import/Export**: Import files from the local file system using
[Deno's File System APIs](/api/deno/file-system) **Local Storage**: Save files
to localStorage for persistence between sessions with
[Deno's Web Storage APIs](/api/web/~/Storage) **Folder Support**: Implement
nested folders for better organization

🦕 You've now built a functional in-browser virtual file system and code editor
using `URL.createObjectURL()`. This technique can be used for a variety of
applications, from code editors and IDEs to browser-based games and file
managers.

The beauty of this approach is that it works entirely client-side, requiring no
server storage or processing. Users can create, edit, and preview files directly
in their browser, with all data stored in memory.
