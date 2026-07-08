---
last_modified: 2026-07-08
title: "WebGPU rendering"
description: "Draw to a native window with WebGPU on the raw backend: request an adapter, wrap the window as an UnsafeWindowSurface, configure a canvas context, and run a render loop."
---

:::info Available in Deno 2.9

`deno desktop` is available starting in Deno v2.9.0. If you're on an earlier
version, [update Deno](/runtime/reference/cli/upgrade/) to use it.

:::

The [raw backend](/runtime/desktop/backends/#raw) gives you a native window with
no web engine attached. Instead of loading HTML, you draw to the window yourself
with [WebGPU](/api/web/~/GPUDevice). This is the right backend for games,
visualizations, emulators, and any app that renders its own pixels rather than a
document.

The bridge between a window and WebGPU is
[`Deno.BrowserWindow.getNativeWindow()`](/api/deno/~/Deno.BrowserWindow.prototype.getNativeWindow),
which hands back a
[`Deno.UnsafeWindowSurface`](/api/deno/~/Deno.UnsafeWindowSurface). That surface
exposes a WebGPU canvas context, so the same `context.configure()` /
`getCurrentTexture()` / `present()` flow you'd use in a browser works against a
real OS window.

## Setup

WebGPU is behind an unstable flag, and the raw backend is selected in
`deno.json`:

```json title="deno.json"
{
  "desktop": {
    "backend": "raw"
  },
  "unstable": ["webgpu"]
}
```

Unlike `cef` and `webview`, `raw` cannot be passed with `--backend` on the
command line — it is only selectable through the `desktop.backend` field. See
[Backends](/runtime/desktop/backends/#raw).

## A minimal example

The smallest useful program: open a window and clear it to a solid color. This
proves the whole pipeline — adapter, surface, context, present — is wired up
before you add any drawing.

```ts title="main.ts"
// A WebGPU context must exist before the native surface can be wrapped, so
// acquire the adapter and device first.
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error("no WebGPU adapter available");
const device = await adapter.requestDevice();

const win = new Deno.BrowserWindow({
  title: "WebGPU",
  width: 640,
  height: 480,
});

// Wrap the native window as a surface and configure a WebGPU context on it.
const surface = win.getNativeWindow();
const format = navigator.gpu.getPreferredCanvasFormat();
const context = surface.getContext("webgpu");
context.configure({ device, format, alphaMode: "opaque" });

// Match the surface to the window before the first frame.
const [width, height] = win.getSize();
surface.width = width;
surface.height = height;

// Clear the frame to teal and present it.
const encoder = device.createCommandEncoder();
encoder.beginRenderPass({
  colorAttachments: [{
    view: context.getCurrentTexture().createView(),
    clearValue: { r: 0, g: 0.5, b: 0.5, a: 1 },
    loadOp: "clear",
    storeOp: "store",
  }],
}).end();
device.queue.submit([encoder.finish()]);
surface.present();
```

Build and run it:

```sh
deno desktop main.ts
./main      # macOS / Linux
.\main.exe  # Windows
```

`surface.present()` is what actually pushes the encoded frame to the display;
without it the window stays blank. Calling it once, as above, leaves a static
frame on screen until the window closes.

## Drawing geometry

Clearing to a color exercises the surface but draws nothing. A render pipeline
with a WGSL shader is the "hello world" of GPU graphics. This example draws a
single triangle whose vertex colors are interpolated across its face — no vertex
buffers, the positions are baked into the shader.

```ts title="triangle.ts"
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error("no WebGPU adapter available");
const device = await adapter.requestDevice();

const win = new Deno.BrowserWindow({
  title: "Triangle",
  width: 640,
  height: 480,
});

const surface = win.getNativeWindow();
const format = navigator.gpu.getPreferredCanvasFormat();
const context = surface.getContext("webgpu");
context.configure({ device, format, alphaMode: "opaque" });

const [width, height] = win.getSize();
surface.width = width;
surface.height = height;

// The vertex stage emits three corners; the fragment stage receives the
// color interpolated between them.
const shader = device.createShaderModule({
  code: `
    struct VertexOut {
      @builtin(position) pos: vec4f,
      @location(0) color: vec3f,
    };

    @vertex
    fn vs(@builtin(vertex_index) i: u32) -> VertexOut {
      var positions = array<vec2f, 3>(
        vec2f( 0.0,  0.6),
        vec2f(-0.6, -0.6),
        vec2f( 0.6, -0.6),
      );
      var colors = array<vec3f, 3>(
        vec3f(1.0, 0.0, 0.0),
        vec3f(0.0, 1.0, 0.0),
        vec3f(0.0, 0.0, 1.0),
      );
      var out: VertexOut;
      out.pos = vec4f(positions[i], 0.0, 1.0);
      out.color = colors[i];
      return out;
    }

    @fragment
    fn fs(in: VertexOut) -> @location(0) vec4f {
      return vec4f(in.color, 1.0);
    }
  `,
});

const pipeline = device.createRenderPipeline({
  layout: "auto",
  vertex: { module: shader, entryPoint: "vs" },
  fragment: { module: shader, entryPoint: "fs", targets: [{ format }] },
  primitive: { topology: "triangle-list" },
});

const encoder = device.createCommandEncoder();
const pass = encoder.beginRenderPass({
  colorAttachments: [{
    view: context.getCurrentTexture().createView(),
    clearValue: { r: 0.05, g: 0.05, b: 0.08, a: 1 },
    loadOp: "clear",
    storeOp: "store",
  }],
});
pass.setPipeline(pipeline);
pass.draw(3);
pass.end();
device.queue.submit([encoder.finish()]);
surface.present();
```

## Animating with a render loop

For anything that moves, draw repeatedly. The raw backend has no DOM, so there
is no `requestAnimationFrame` — schedule frames yourself. This example reuses
the triangle pipeline and passes the elapsed time into the shader through a
uniform buffer to spin it.

```ts title="spin.ts"
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error("no WebGPU adapter available");
const device = await adapter.requestDevice();

const win = new Deno.BrowserWindow({ title: "Spin", width: 640, height: 480 });

const surface = win.getNativeWindow();
const format = navigator.gpu.getPreferredCanvasFormat();
const context = surface.getContext("webgpu");
context.configure({ device, format, alphaMode: "opaque" });

// Keep the surface sized to the window, and reconfigure whenever it resizes.
function resize() {
  const [width, height] = win.getSize();
  surface.width = width;
  surface.height = height;
}
resize();
win.addEventListener("resize", resize);

const shader = device.createShaderModule({
  code: `
    @group(0) @binding(0) var<uniform> angle: f32;

    struct VertexOut {
      @builtin(position) pos: vec4f,
      @location(0) color: vec3f,
    };

    @vertex
    fn vs(@builtin(vertex_index) i: u32) -> VertexOut {
      var base = array<vec2f, 3>(
        vec2f( 0.0,  0.6),
        vec2f(-0.6, -0.6),
        vec2f( 0.6, -0.6),
      );
      var colors = array<vec3f, 3>(
        vec3f(1.0, 0.0, 0.0),
        vec3f(0.0, 1.0, 0.0),
        vec3f(0.0, 0.0, 1.0),
      );
      let s = sin(angle);
      let c = cos(angle);
      let p = base[i];
      var out: VertexOut;
      out.pos = vec4f(p.x * c - p.y * s, p.x * s + p.y * c, 0.0, 1.0);
      out.color = colors[i];
      return out;
    }

    @fragment
    fn fs(in: VertexOut) -> @location(0) vec4f {
      return vec4f(in.color, 1.0);
    }
  `,
});

const uniform = device.createBuffer({
  size: 4, // one f32
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const pipeline = device.createRenderPipeline({
  layout: "auto",
  vertex: { module: shader, entryPoint: "vs" },
  fragment: { module: shader, entryPoint: "fs", targets: [{ format }] },
  primitive: { topology: "triangle-list" },
});

const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: uniform } }],
});

const start = performance.now();

function frame() {
  if (win.isClosed()) return;

  const angle = (performance.now() - start) / 1000;
  device.queue.writeBuffer(uniform, 0, new Float32Array([angle]));

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0.05, g: 0.05, b: 0.08, a: 1 },
      loadOp: "clear",
      storeOp: "store",
    }],
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.draw(3);
  pass.end();
  device.queue.submit([encoder.finish()]);
  surface.present();

  setTimeout(frame, 16); // ~60 fps
}

win.addEventListener("close", () => Deno.exit(0));
frame();
```

A self-scheduling `setTimeout` gives you a frame roughly every 16 ms. The
`win.isClosed()` guard stops the loop once the window goes away, and the `close`
listener exits the process; otherwise the pending timer would keep the runtime
alive with nothing on screen.

## Key details

- **Request the adapter before wrapping the window.**
  [`getNativeWindow()`](/api/deno/~/Deno.BrowserWindow.prototype.getNativeWindow)
  needs an active WebGPU context and throws if you call it before
  [`navigator.gpu.requestAdapter()`](/api/web/~/GPU.prototype.requestAdapter).

- **Size the surface, and resize it.** Set `surface.width` / `surface.height`
  before the first frame, and update them (and let the context reconfigure)
  whenever the window's [`resize`](/runtime/desktop/windows/#events) event
  fires. A surface that doesn't match the window is stretched or clipped.

- **`present()` every frame.** Encoding and submitting a render pass draws into
  the swapchain texture;
  [`present()`](/api/deno/~/Deno.UnsafeWindowSurface.prototype.present) is what
  puts it on screen. Skip it and the window stays blank.

- **Get a fresh texture each frame.** Call
  `context.getCurrentTexture().createView()` inside the loop — the swapchain
  hands you a different texture per frame.

- **Closing is downgraded to hiding.** Once a surface has been taken from a
  window, [`close()`](/runtime/desktop/windows/#lifecycle) hides the window
  instead of destroying it, so the native handles WebGPU is rendering into are
  not freed underneath it. Call [`Deno.exit()`](/api/deno/~/Deno.exit) to end
  the process, as the render loop above does on the `close` event.

## Related

- [Backends](/runtime/desktop/backends/) — when to choose `raw` over `cef` /
  `webview`.
- [Windows](/runtime/desktop/windows/) —
  [`Deno.BrowserWindow`](/api/deno/~/Deno.BrowserWindow) lifecycle, sizing, and
  events.
- [WebGPU API](/api/web/~/GPUDevice) and the
  [WGSL specification](https://www.w3.org/TR/WGSL/).
