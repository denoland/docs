/**
 * @title Render triangle to a window with WebGPU
 * @difficulty intermediate
 * @tags cli
 * @run --unstable-webgpu <url>
 * @resource {https://github.com/denoland/webgpu-examples} More WebGPU examples
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API} WebGPU API documentation
 * @resource {https://webgpufundamentals.org/webgpu/lessons/webgpu-fundamentals.html} WebGPU fundamentals
 * @group Unstable APIs
 */

// Import resources from https://github.com/denoland/webgpu-examples/blob/main/utils.ts
// and Deno Standard Library's WebGPU module
import { copyToBuffer, createPng, Dimensions } from "../utils.ts";
import { createCapture } from "@jsr:std/webgpu@0.224.7";

const dimensions: Dimensions = {
  width: 200,
  height: 200,
};
const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

if (!device) {
  console.error("no suitable adapter found");
  Deno.exit(0);
}

// Define the vertex and fragment shaders that generate
// the triangle using WebGPU Shading Language (WGSL)
const shaderCode = `
@vertex
fn vs_main(@builtin(vertex_index) in_vertex_index: u32) -> @builtin(position) vec4<f32> {
    let x = f32(i32(in_vertex_index) - 1);
    let y = f32(i32(in_vertex_index & 1u) * 2 - 1);
    return vec4<f32>(x, y, 0.0, 1.0);
}

@fragment
fn fs_main() -> @location(0) vec4<f32> {
    return vec4<f32>(1.0, 0.0, 0.0, 1.0);
}
`;

// Creating a compiled shader module on GPU
const shaderModule = device.createShaderModule({
  code: shaderCode,
});

// Define pipelines for executing shader modules
const pipelineLayout = device.createPipelineLayout({
  bindGroupLayouts: [],
});
const renderPipeline = device.createRenderPipeline({
  layout: pipelineLayout,
  vertex: {
    module: shaderModule,
    entryPoint: "vs_main",
  },
  fragment: {
    module: shaderModule,
    entryPoint: "fs_main",
    targets: [
      {
        format: "rgba8unorm-srgb",
      },
    ],
  },
});

// Create a texture and buffer to use as a capture
const { texture, outputBuffer } = createCapture(
  device,
  dimensions.width,
  dimensions.height,
);

// Create command encoder, which will encode commands
// into command buffer, and render commands
const encoder = device.createCommandEncoder();
const renderPass = encoder.beginRenderPass({
  colorAttachments: [
    {
      view: texture.createView(),
      storeOp: "store",
      loadOp: "clear",
      clearValue: [0, 1, 0, 1],
    },
  ],
});
renderPass.setPipeline(renderPipeline);
renderPass.draw(3, 1);
renderPass.end();

// Copy all to buffer
copyToBuffer(encoder, texture, outputBuffer, dimensions);

// Submit buffer to have WebGPU execute commands
device.queue.submit([encoder.finish()]);

// Create the png from the output buffer and defined dimensions
await createPng(outputBuffer, dimensions);
