---
title: Node APIs
templateEngine: [vto, md]
oldUrl:
- /runtime/manual/node/compatibility/
- /runtime/manual/npm_nodejs/compatibility_mode/
---

Deno provides polyfills for a number of built-in Node.js modules and globals.

<a href="/api/node/" class="docs-cta runtime-cta">Explore built-in Node APIs</a>

Node compatibility is an ongoing project - help us identify gaps and let us know
which modules you need by
[opening an issue on GitHub](https://github.com/denoland/deno).

## Compatibility status

<div class="flex flex-row gap-3 flex-wrap items-center mb-2">
  <div>
    <svg class="status-icon status-good" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
     = Full support
  </div>
  <div>
    <svg class="status-icon status-info" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
    = Partial support</div>
  <div>
    <svg class="status-icon status-unsupported" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
     = Stubs only or unsupported
  </div>
</div>

{{ await generateNodeCompatability() }}

## Globals

This is the list of Node globals that Deno supports. These globals are only
available in the `npm` package scope. In your own code you can use them by
importing them from the relevant `node:` module.

| Global name                                                                                                      | Status                                       |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [`AbortController`](https://nodejs.org/api/globals.html#class-abortcontroller)                                   | ✅                                           |
| [`AbortSignal`](https://nodejs.org/api/globals.html#class-abortsignal)                                           | ✅                                           |
| [`Blob`](https://nodejs.org/api/globals.html#class-blob)                                                         | ✅                                           |
| [`Buffer`](https://nodejs.org/api/globals.html#class-buffer)                                                     | ✅                                           |
| [`ByteLengthQueuingStrategy`](https://nodejs.org/api/globals.html#class-bytelengthqueuingstrategy)               | ✅                                           |
| [`__dirname`](https://nodejs.org/api/globals.html#__dirname)                                                     | ⚠️ [Info](./migrate/#node.js-global-objects) |
| [`__filename`](https://nodejs.org/api/globals.html#__filename)                                                   | ⚠️ [Info](./migrate/#nodejs-global-objects)  |
| [`atob`](https://nodejs.org/api/globals.html#atobdata)                                                           | ✅                                           |
| [`BroadcastChannel`](https://nodejs.org/api/globals.html#broadcastchannel)                                       | ✅                                           |
| [`btoa`](https://nodejs.org/api/globals.html#btoadata)                                                           | ✅                                           |
| [`clearImmediate`](https://nodejs.org/api/globals.html#clearimmediateimmediateobject)                            | ✅                                           |
| [`clearInterval`](https://nodejs.org/api/globals.html#clearintervalintervalobject)                               | ✅                                           |
| [`clearTimeout`](https://nodejs.org/api/globals.html#cleartimeouttimeoutobject)                                  | ✅                                           |
| [`CompressionStream`](https://nodejs.org/api/globals.html#class-compressionstream)                               | ✅                                           |
| [`console`](https://nodejs.org/api/globals.html#console)                                                         | ✅                                           |
| [`CountQueuingStrategy`](https://nodejs.org/api/globals.html#class-countqueuingstrategy)                         | ✅                                           |
| [`Crypto`](https://nodejs.org/api/globals.html#crypto)                                                           | ✅                                           |
| [`CryptoKey`](https://nodejs.org/api/globals.html#cryptokey)                                                     | ✅                                           |
| [`CustomEvent`](https://nodejs.org/api/globals.html#customevent)                                                 | ✅                                           |
| [`CustomEvent`](https://nodejs.org/api/globals.html#customevent)                                                 | ✅                                           |
| [`DecompressionStream`](https://nodejs.org/api/globals.html#class-decompressionstream)                           | ✅                                           |
| [`Event`](https://nodejs.org/api/globals.html#event)                                                             | ✅                                           |
| [`EventTarget`](https://nodejs.org/api/globals.html#eventtarget)                                                 | ✅                                           |
| [`exports`](https://nodejs.org/api/globals.html#exports)                                                         | ✅                                           |
| [`fetch`](https://nodejs.org/api/globals.html#fetch)                                                             | ✅                                           |
| [`fetch`](https://nodejs.org/api/globals.html#fetch)                                                             | ✅                                           |
| [`File`](https://nodejs.org/api/globals.html#class-file)                                                         | ✅                                           |
| [`File`](https://nodejs.org/api/globals.html#class-file)                                                         | ✅                                           |
| [`FormData`](https://nodejs.org/api/globals.html#class-formdata)                                                 | ✅                                           |
| [`global`](https://nodejs.org/api/globals.html#global)                                                           | ✅                                           |
| [`Headers`](https://nodejs.org/api/globals.html#class-headers)                                                   | ✅                                           |
| [`MessageChannel`](https://nodejs.org/api/globals.html#messagechannel)                                           | ✅                                           |
| [`MessageEvent`](https://nodejs.org/api/globals.html#messageevent)                                               | ✅                                           |
| [`MessagePort`](https://nodejs.org/api/globals.html#messageport)                                                 | ✅                                           |
| [`module`](https://nodejs.org/api/globals.html#module)                                                           | ✅                                           |
| [`PerformanceEntry`](https://nodejs.org/api/globals.html#performanceentry)                                       | ✅                                           |
| [`PerformanceMark`](https://nodejs.org/api/globals.html#performancemark)                                         | ✅                                           |
| [`PerformanceMeasure`](https://nodejs.org/api/globals.html#performancemeasure)                                   | ✅                                           |
| [`PerformanceObserver`](https://nodejs.org/api/globals.html#performanceobserver)                                 | ✅                                           |
| [`PerformanceObserverEntryList`](https://nodejs.org/api/globals.html#performanceobserverentrylist)               | ❌                                           |
| [`PerformanceResourceTiming`](https://nodejs.org/api/globals.html#performanceresourcetiming)                     | ❌                                           |
| [`performance`](https://nodejs.org/api/globals.html#performance)                                                 | ✅                                           |
| [`process`](https://nodejs.org/api/globals.html#process)                                                         | ✅                                           |
| [`queueMicrotask`](https://nodejs.org/api/globals.html#queuemicrotaskcallback)                                   | ✅                                           |
| [`ReadableByteStreamController`](https://nodejs.org/api/globals.html#class-readablebytestreamcontroller)         | ✅                                           |
| [`ReadableStream`](https://nodejs.org/api/globals.html#class-readablestream)                                     | ✅                                           |
| [`ReadableStreamBYOBReader`](https://nodejs.org/api/globals.html#class-readablestreambyobreader)                 | ✅                                           |
| [`ReadableStreamBYOBRequest`](https://nodejs.org/api/globals.html#class-readablestreambyobrequest)               | ✅                                           |
| [`ReadableStreamDefaultController`](https://nodejs.org/api/globals.html#class-readablestreamdefaultcontroller)   | ✅                                           |
| [`ReadableStreamDefaultReader`](https://nodejs.org/api/globals.html#class-readablestreamdefaultreader)           | ✅                                           |
| [`require`](https://nodejs.org/api/globals.html#require)                                                         | ✅                                           |
| [`Response`](https://nodejs.org/api/globals.html#response)                                                       | ✅                                           |
| [`Request`](https://nodejs.org/api/globals.html#request)                                                         | ✅                                           |
| [`setImmediate`](https://nodejs.org/api/globals.html#setimmediatecallback-args)                                  | ✅                                           |
| [`setInterval`](https://nodejs.org/api/globals.html#setintervalcallback-delay-args)                              | ✅                                           |
| [`setTimeout`](https://nodejs.org/api/globals.html#settimeoutcallback-delay-args)                                | ✅                                           |
| [`structuredClone`](https://nodejs.org/api/globals.html#structuredclonevalue-options)                            | ✅                                           |
| [`structuredClone`](https://nodejs.org/api/globals.html#structuredclonevalue-options)                            | ✅                                           |
| [`SubtleCrypto`](https://nodejs.org/api/globals.html#subtlecrypto)                                               | ✅                                           |
| [`DOMException`](https://nodejs.org/api/globals.html#domexception)                                               | ✅                                           |
| [`TextDecoder`](https://nodejs.org/api/globals.html#textdecoder)                                                 | ✅                                           |
| [`TextDecoderStream`](https://nodejs.org/api/globals.html#class-textdecoderstream)                               | ✅                                           |
| [`TextEncoder`](https://nodejs.org/api/globals.html#textencoder)                                                 | ✅                                           |
| [`TextEncoderStream`](https://nodejs.org/api/globals.html#class-textencoderstream)                               | ✅                                           |
| [`TransformStream`](https://nodejs.org/api/globals.html#class-transformstream)                                   | ✅                                           |
| [`TransformStreamDefaultController`](https://nodejs.org/api/globals.html#class-transformstreamdefaultcontroller) | ✅                                           |
| [`URL`](https://nodejs.org/api/globals.html#url)                                                                 | ✅                                           |
| [`URLSearchParams`](https://nodejs.org/api/globals.html#urlsearchparams)                                         | ✅                                           |
| [`URLSearchParams`](https://nodejs.org/api/globals.html#urlsearchparams)                                         | ✅                                           |
| [`WebAssembly`](https://nodejs.org/api/globals.html#webassembly)                                                 | ✅                                           |
| [`WritableStream`](https://nodejs.org/api/globals.html#class-writablestream)                                     | ✅                                           |
| [`WritableStreamDefaultController`](https://nodejs.org/api/globals.html#class-writablestreamdefaultcontroller)   | ✅                                           |
| [`WritableStreamDefaultWriter`](https://nodejs.org/api/globals.html#class-writablestreamdefaultwriter)           | ✅                                           |
