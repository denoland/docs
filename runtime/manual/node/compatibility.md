---
title: "Node API Compatibility List"
oldUrl: /runtime/manual/npm_nodejs/compatibility_mode/
---

Deno provides polyfills for a number of built-in Node.js modules and globals.
For a full list of Node built-in modules, see the
[reference](https://docs.deno.com/api/node/).

Node compatibility is an ongoing project - help us identify gaps and let us know
which modules you need by
[opening an issue on GitHub](https://github.com/denoland/deno).

## Built-in module support

<div style="display: flex; flex-direction: row; gap: 10px; flex-wrap: wrap; margin-bottom: 10px">
  <div>✅ = Full support</div>
  <div>ℹ️ = Partial support</div>
  <div>❌ = Stubs only</div>
</div>

<details>
  <summary>
    <code>node:assert</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/assert/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:async_hooks</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    <code>AsyncLocalStorage</code> is supported. <code>AsyncResource</code>,
    <code>executionAsyncId</code>, and <code>createHook</code> are
    non-functional stubs.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/async_hooks/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:buffer</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/buffer/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:child_process</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/child_process/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:cluster</code>
    <div style="float: right">
      <span>❌</span>
    </div>
  </summary>
  <p>All exports are non-functional stubs.</p>
  <p>
    <a href="https://docs.deno.com/api/node/cluster/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:console</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/console/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:crypto</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Missing <code>Certificate</code> class,
    <code>crypto.Cipheriv.prototype.setAutoPadding</code>,
    <code>crypto.Decipheriv.prototype.setAutoPadding</code>,
    <code>crypto.publicDecrypt</code>,
    <code>crypto.ECDH.prototype.convertKey</code>, <code>x448</code> option for
    <code>generateKeyPair</code>, <code>crypto.KeyObject</code>,
    <code>safe</code>, <code>add</code> and <code>rem</code> options for
    <code>generatePrime</code>, <code>crypto.Sign.prototype.sign</code> and
    <code>crypto.Verify.prototype.verify</code> with non <code>BinaryLike</code>
    input, <code>crypto.secureHeapUsed</code>, <code>crypto.setEngine</code>,
    legacy methods of <code>crypto.X509Certificate</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/crypto/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:dgram</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Some <code>dgram.Socket</code> instance methods are non-functional stubs:
    <ul>
        <li><code>addMembership</code></li>
        <li><code>addSourceSpecificMembership</code></li>
        <li><code>dropMembership</code></li>
        <li><code>dropSourceSpecificMembership</code></li>
        <li><code>setBroadcast</code></li>
        <li><code>setMulticastInterface</code></li>
        <li><code>setMulticastLoopback</code></li>
        <li><code>setMulticastTtl</code></li>
        <li><code>setTtl</code></li>
    </ul>
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/dgram/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:diagnostics_channel</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/diagnostics_channel/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:dns</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>dns.resolve*</code> with <code>ttl</code> option.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/dns/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:domain</code>
    <div style="float: right">
      <span>❌</span>
    </div>
  </summary>
  <p>All exports are non-functional stubs. This is a deprecated Node module.</p>
  <p>
    <a href="https://docs.deno.com/api/node/domain/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:events</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/events/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:fs</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <h5>
    <code>node:fs</code>
  </h5>
  <p>
    Missing <code>utf16le</code>, <code>latin1</code> and <code>ucs2</code>
    encoding for <code>fs.writeFile</code> and <code>fs.writeFileSync</code>.
  </p>
  <h5>
    <code>node:fs/promises</code>
  </h5>
  <p>
    Missing <code>lchmod</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/fs/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:http</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    <code>createConnection</code> option is currently not supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/http/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:http2</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Partially supported, major work in progress to enable <code>grpc-js</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/http2/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:https</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>https.Server.opts.cert</code> and
    <code>https.Server.opts.key</code> array type.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/https/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:inspector</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    <code>console</code> is supported. Other APIs are stubs and will throw an
    error.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/inspector/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:module</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    The `register()` function is not supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/module/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:net</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>net.Socket.prototype.constructor</code> with <code>fd</code>
    option.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/net/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:os</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/os/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:path</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/path/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:perf_hooks</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>perf_hooks.eventLoopUtilization</code>,
    <code>perf_hooks.timerify</code>,
    <code>perf_hooks.monitorEventLoopDelay</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/perf_hooks/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:punycode</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/punycode/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:process</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>multipleResolves</code>, <code>worker</code> events.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/process/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:querystring</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/querystring/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:readline</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/readline/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:repl</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    <code>builtinModules</code> and <code>_builtinLibs</code> are supported.
    Missing <code>REPLServer.prototype.constructor</code> and
    <code>start()</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/repl/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:stream</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/stream/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:string_decoder</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/string_decoder/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:sys</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/util/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:test</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Currently only <code>test</code> API is supported.
  </p>
  <p>
    <a href="https://nodejs.org/api/test.html">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:timers</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/timers/promises/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:tls</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>createSecurePair</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/tls/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:trace_events</code>
    <div style="float: right">
      <span>❌</span>
    </div>
  </summary>
  <p>All exports are non-functional stubs.</p>
  <p>
    <a href="https://docs.deno.com/api/node/trace_events/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:tty</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/tty/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:util</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>aborted</code>, <code>transferableAbortSignal</code>, <code>transferableAbortController</code>, <code>MIMEParams</code>, <code>MIMEType</code>and <code>getSystemErrorMap</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/util/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:url</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/url/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:v8</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    <code>cachedDataVersionTag</code> and <code>getHeapStatistics</code> are
    supported. <code>setFlagsFromStrings</code> is a noop. Other APIs are not
    supported and will throw and error.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/v8/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:vm</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Partial support.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/vm/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:wasi</code>
    <div style="float: right">
      <span>❌</span>
    </div>
  </summary>
  <p>All exports are non-functional stubs.</p>
  <p>
    <a href="https://docs.deno.com/api/node/wasi/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:worker_threads</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>parentPort.emit</code>,
    <code>parentPort.removeAllListeners</code>,
    <code>markAsUntransferable</code>, <code>moveMessagePortToContext</code>,
    <code>receiveMessageOnPort</code>,
    <code>Worker.prototype.getHeapSnapshot</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/worker_threads/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:zlib</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/zlib/~/Zlib">Reference docs</a>
  </p>
</details>

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
