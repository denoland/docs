/**
 * @title Generate downloadable files
 * @difficulty beginner
 * @tags web
 * @run --allow-net
 * @resource {https://docs.deno.com/api/web/~/URL.createObjectURL } Doc: Deno.createObjectURL
 * @group Web Standard APIs
 *
 * Demonstrates using URL.createObjectURL() to create a downloadable text file from in-memory content.
 */

// Create a basic HTML page with JavaScript that uses URL.createObjectURL()
const html = `<!DOCTYPE html>
<html>
<head>
  <title>URL.createObjectURL Demo</title>
  <style>
    body {
      font-family: sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .example {
      margin-bottom: 30px;
      border-bottom: 1px solid #eee;deno
      padding-bottom: 20px;
    }
  </style>
</head>
<body>
  <h1>URL.createObjectURL Examples in Deno</h1>
  
  <div class="example">
    <h2>Example 1: Generate Downloadable Text File</h2>
    <button id="generateText">Generate Text File</button>
    <p>Creates a Blob containing text and generates a downloadable link</p>
  </div>

  <div class="example">
    <h2>Example 2: Generate JSON File</h2>
    <button id="generateJSON">Generate JSON File</button>
    <p>Creates a Blob containing JSON data and generates a downloadable link</p>
  </div>

  <div class="example">
    <h2>Example 3: Draw on Canvas and Export</h2>
    <canvas id="drawCanvas" width="400" height="200" style="border: 1px solid #000;"></canvas>
    <div>
      <button id="clearCanvas">Clear</button>
      <button id="downloadCanvas">Download as PNG</button>
    </div>
    <p>Draw on the canvas above and download the result as a PNG image</p>
  </div>

  <script>
    // Example 1: Generate a text file
    document.getElementById("generateText").addEventListener("click", () => {
      // Create content for the text file
      const text = "This is a text file generated using URL.createObjectURL()\\n" +
                   "You can create files on the fly without server interaction!\\n" +
                   "Date created: " + new Date().toLocaleString();
      
      // Create a Blob containing the text
      const blob = new Blob([text], { type: "text/plain" });
      
      // Create object URL
      const url = URL.createObjectURL(blob);
      
      // Create a link to download the file
      const link = document.createElement("a");
      link.href = url;
      link.download = "generated-file.txt";
      link.click();
      
      // Release the object URL when done
      setTimeout(() => URL.revokeObjectURL(url), 100);
    });

    // Example 2: Generate a JSON file
    document.getElementById("generateJSON").addEventListener("click", () => {
      // Create sample data
      const data = {
        name: "Example Data",
        items: [
          { id: 1, value: "Item 1" },
          { id: 2, value: "Item 2" },
          { id: 3, value: "Item 3" }
        ],
        timestamp: new Date().toISOString()
      };
      
      // Create a Blob containing the JSON data
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      
      // Create object URL
      const url = URL.createObjectURL(blob);
      
      // Create a link to download the file
      const link = document.createElement("a");
      link.href = url;
      link.download = "data.json";
      link.click();
      
      // Release the object URL when done
      setTimeout(() => URL.revokeObjectURL(url), 100);
    });

    // Example 3: Canvas drawing and export
    const canvas = document.getElementById("drawCanvas");
    const ctx = canvas.getContext("2d");
    let isDrawing = false;
    
    // Initialize canvas with white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Setup canvas drawing
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);
    
    function startDrawing(e) {
      isDrawing = true;
      draw(e);
    }
    
    function draw(e) {
      if (!isDrawing) return;
      
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    
    function stopDrawing() {
      isDrawing = false;
      ctx.beginPath();
    }
    
    // Clear canvas
    document.getElementById("clearCanvas").addEventListener("click", () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    });
    
    // Download canvas as image
    document.getElementById("downloadCanvas").addEventListener("click", () => {
      // Convert canvas to a Blob
      canvas.toBlob((blob) => {
        // Create object URL from Blob
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement("a");
        link.href = url;
        link.download = "drawing.png";
        link.click();
        
        // Clean up
        URL.revokeObjectURL(url);
      }, "image/png");
    });
  </script>
</body>
</html>`;

// Start a simple server to serve the HTML page
console.log("Starting server at http://localhost:8000");
await Deno.serve((req) => {
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}, { port: 8000 });
