/**
 * @title Run a compute shader with WebGPU
 * @difficulty intermediate
 * @tags cli
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API} MDN: WebGPU API
 * @resource {https://www.w3.org/TR/WGSL/} WGSL specification
 * @group Web standard APIs
 *
 * WebGPU gives JavaScript direct access to the GPU, and unlike WebGL it is
 * not limited to graphics: compute shaders run arbitrary parallel
 * computation. Deno implements the WebGPU API natively, so the same code
 * that runs in the browser runs on the command line. This example doubles
 * an array of floats on the GPU.
 */

// Request an adapter (a physical GPU) and a device (a logical connection
// to it). On machines without a GPU, requestAdapter resolves to null.
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) throw new Error("No GPU adapter found");
const device = await adapter.requestDevice();

// Compute shaders are written in WGSL. This one reads and writes a storage
// buffer; each invocation handles one element, and the workgroup size
// controls how many invocations run together.
const shader = `
@group(0) @binding(0) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3u) {
  if (id.x < arrayLength(&data)) {
    data[id.x] = data[id.x] * 2.0;
  }
}`;

// Compile the shader and build a compute pipeline around its entry point.
const module = device.createShaderModule({ code: shader });
const pipeline = device.createComputePipeline({
  layout: "auto",
  compute: { module },
});

// Upload the input data into a storage buffer on the GPU.
const input = new Float32Array([1, 2, 3, 4]);
const storageBuffer = device.createBuffer({
  size: input.byteLength,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC |
    GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(storageBuffer, 0, input);

// GPU buffers cannot be read directly from JavaScript, so create a second
// buffer that can be mapped for reading and will receive a copy of the
// results.
const readBuffer = device.createBuffer({
  size: input.byteLength,
  usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
});

// Bind the storage buffer to the shader's binding 0, then record the
// commands: run the pipeline with enough workgroups to cover the array,
// and copy the results into the readable buffer.
const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: storageBuffer } }],
});
const encoder = device.createCommandEncoder();
const pass = encoder.beginComputePass();
pass.setPipeline(pipeline);
pass.setBindGroup(0, bindGroup);
pass.dispatchWorkgroups(Math.ceil(input.length / 64));
pass.end();
encoder.copyBufferToBuffer(storageBuffer, 0, readBuffer, 0, input.byteLength);

// Submit the work to the GPU queue, then map the read buffer to pull the
// results back into JavaScript.
device.queue.submit([encoder.finish()]);
await readBuffer.mapAsync(GPUMapMode.READ);
const output = new Float32Array(readBuffer.getMappedRange());
console.log([...output]); // [ 2, 4, 6, 8 ]
