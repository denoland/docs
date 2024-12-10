/**
 * @title Web assembly
 * @difficulty intermediate
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://webassembly.github.io/spec/core/syntax/modules.html} WebAssembly Spec: Modules
 * @resource {https://webassembly.github.io/spec/core/syntax/instructions.html} WebAssembly Spec: Instructions
 * @resource {https://webassembly.github.io/spec/core/syntax/values.html} WebAssembly Spec: Values
 * @resource {https://webassembly.github.io/spec/core/syntax/types.html} WebAssembly Spec: Types
 * @group Advanced
 *
 * WebAssembly is a binary format for describing a program's data and instructions.
 * It is a new and more efficient binary format.
 */

// We create a new Uint8Array with the bytes of the WebAssembly module.
// This is usually the output of some compiler and not written by hand.
// deno-fmt-ignore
const bytes = new Uint8Array([
  0,97,115,109,1,0,0,0,1,7,1,96,2,
  127,127,1,127,2,1,0,3,2,1,0,4,1,
  0,5,1,0,6,1,0,7,7,1,3,97,100,100,
  0,0,9,1,0,10,10,1,8,0,32,0,32,1,
  106,15,11,11,1,0,
]);
// We create an interface for the WebAssembly module containing all exports.
interface WebAssemblyExports {
  add(a: number, b: number): number;
}
// The WebAssembly module is a binary format for describing a program's data and instructions.
const exports = await WebAssembly.instantiate(bytes);
// We get the exports from the WebAssembly module and cast it to the interface.
const functions = exports.instance.exports as unknown as WebAssemblyExports;
// We call the exported function.
console.log(functions.add(1, 2)); // 3
