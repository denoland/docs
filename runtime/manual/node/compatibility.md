# Node API Compatibility List

Deno provides polyfills for a number of built-in Node.js modules and globals.
Node compatibility is an ongoing project - help us identify gaps and let us know
which modules you need by
[opening an issue on GitHub](https://github.com/denoland/deno).

### Built-in modules

<table>

<tr>
  <th>Module</th>
  <th>Support&nbsp;Level</th>
  <th>Notes</th>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/assert.html">
      <code>node:assert</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td></td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/assert.html">
      <code>node:assert/strict</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td></td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/async_hooks.html">
      <code>node:async_hooks</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <code>AsyncLocalStorage</code> is supported.
    <code>AsyncResource</code>,
    <code>executionAsyncId</code>, and
    <code>createHook</code> are non-functional stubs.
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/buffer.html">
      <code>node:buffer</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/child_process.html">
      <code>node:child_process</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    The <code>ipc</code> and <code>overlapped</code> stdio options are missing.
    Passing file descriptors by an integer value is missing.
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/cluster.html">
      <code>node:cluster</code>
    </a>
  </td>
  <td>
    ❌ Missing
  </td>
  <td>
    All exports are non-functional stubs.
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/console.html">
      <code>node:console</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/crypto.html">
      <code>node:crypto</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    Missing <code>Certificate</code> class,
    <code>crypto.Cipheriv.prototype.setAutoPadding</code>,
    <code>crypto.Decipheriv.prototype.setAutoPadding</code>,
    <code>crypto.getCipherInfo</code>, <code>crypto.publicDecrypt</code>,
    <code>crypto.ECDH.prototype.convertKey</code>,
    <code>crypto.diffieHellman</code>, <code>x448</code> option for
    <code>generateKeyPair</code>, <code>crypto.KeyObject</code>,
    <code>safe</code>, <code>add</code> and <code>rem</code> options for
    <code>generatePrime</code>, <code>crypto.Sign.prototype.sign</code> and
    <code>crypto.Verify.prototype.verify</code> with non <code>BinaryLike</code>
    input, <code>crypto.secureHeapUsed</code>, <code>crypto.setEngine</code>,
    legacy methods of <code>crypto.X509Certificate</code>.
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/dgram.html">
      <code>node:dgram</code>
    </a>
  </td>
  <td>
    ℹ️ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/diagnostics_channel.html">
      <code>node:diagnostics_channel</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/dns.html">
      <code>node:dns</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>Missing <code>dns.resolve*</code> with <code>ttl</code> option.</p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/domain.html">
      <code>node:domain</code>
    </a>
  </td>
  <td>
    ❌ Missing
  </td>
  <td>
    All exports are non-functional stubs.
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/events.html">
      <code>node:events</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/fs.html">
      <code>node:fs</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Missing <code>utf16le</code>, <code>latin1</code> and <code>ucs2</code>
      encoding for <code>fs.writeFile</code> and
      <code>fs.writeFileSync</code>. Missing <code>Dirent.isBlockDevice</code>,
      <code>Dirent.isCharacterDevice</code>,
      <code>Dirent.isFIFO</code>, <code>Dirent.isSocket</code>,
      <code>FSWatcher.ref</code>, <code>FSWatcher.unref</code>.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/fs.html">
      <code>node:fs/promises</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Missing <code>lchmod</code>, <code>lchown</code>, <code>lutimes</code>.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/http.html">
      <code>node:http</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      <code>createConnection</code> option is currently not supported.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/http2.html">
      <code>node:http2</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Partially supported, major work in progress to enable <code>grpc-js</code>.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/https.html">
      <code>node:https</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Missing <code>https.Server.opts.cert</code> and
      <code>https.Server.opts.key</code> array type.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/inspector.html">
      <code>node:inspector</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      <code>console</code> is supported. Other APIs are stubs and will throw an
      error. Due to security implications the Deno team does not plan to
      polyfill these APIs.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/module.html">
      <code>node:module</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/net.html">
      <code>node:net</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Missing <code>net.Socket.prototype.constructor</code> with <code>fd</code>
      option.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/os.html">
      <code>node:os</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/path.html">
      <code>node:path</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/path.html">
      <code>node:path/posix</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/path.html">
      <code>node:path/win32</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/perf_hooks.html">
      <code>node:perf_hooks</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Missing <code>perf_hooks.eventLoopUtilization</code>,
      <code>perf_hooks.timerify</code>,
      <code>perf_hooks.monitorEventLoopDelay</code>.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/process.html">
      <code>node:process</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Missing <code>disconnect</code>, <code>message</code>,
      <code>multipleResolves</code>, <code>rejectionHandled</code> and
      <code>worker</code> events.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/punycode.html">
      <code>node:punycode</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/querystring.html">
      <code>node:querystring</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/readline.html">
      <code>node:readline</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/repl.html">
      <code>node:repl</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      <code>builtinModules</code> and <code>_builtinLibs</code> are supported.
      Missing <code>REPLServer.prototype.constructor</code> and
      <code>start()</code>.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/stream.html">
      <code>node:stream</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/stream.html">
      <code>node:stream/consumers</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/stream.html">
      <code>node:stream/promises</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/stream.html">
      <code>node:stream/web</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/string_decoder.html">
      <code>node:string_decoder</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Missing decoding of <code>ascii</code>, <code>latin1</code> and
      <code>utf16le</code> decoding options.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/util.html">
      <code>node:sys</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
    <p>See <code>node:util</code>.</p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/test.html">
      <code>node:test</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Currently only <code>test</code> API is supported.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/timers.html">
      <code>node:timers</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/timers.html">
      <code>node:timers/promises</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/tls.html">
      <code>node:tls</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Missing <code>createSecurePair</code>.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/tracing.html">
      <code>node:trace_events</code>
    </a>
  </td>
  <td>
    ❌ Missing
  </td>
  <td>
    <p>
      All exports are non-functional stubs.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/tty.html">
      <code>node:tty</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Missing <code>ReadStream</code> and <code>WriteStream</code>
      implementation.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/url.html">
      <code>node:url</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/util.html">
      <code>node:util</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/util.html">
      <code>node:util/types</code>
    </a>
  </td>
  <td>
    ✅ Full
  </td>
  <td>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/v8.html">
      <code>node:v8</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      <code>cachedDataVersionTag</code> and <code>getHeapStatistics</code> are
      supported. <code>setFlagsFromStrings</code> is a noop. Other APIs are not
      supported and will throw and error. The other APIs <em>could</em> be
      polyfilled, but due inherent lack of format stability between the V8
      versions, the Deno team is considering requiring a special flag to use
      them.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/vm.html">
      <code>node:vm</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      <code>runInThisContext</code> is supported. Other APIs are not polyfilled
      and will throw and error.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/wasi.html">
      <code>node:wasi</code>
    </a>
  </td>
  <td>
    ❌ Missing
  </td>
  <td>
    <p>
      All exports are non-functional stubs.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/worker_threads.html">
      <code>node:worker_threads</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Missing <code>parentPort.emit</code>,
      <code>parentPort.removeAllListeners</code>,
      <code>markAsUntransferable</code>, <code>moveMessagePortToContext</code>,
      <code>receiveMessageOnPort</code>,
      <code>Worker.prototype.getHeapSnapshot</code>.
    </p>
  </td>
</tr>

<tr>
  <td>
    <a href="https://nodejs.org/api/zlib.html">
      <code>node:zlib</code>
    </a>
  </td>
  <td>
    ℹ️ Partial
  </td>
  <td>
    <p>
      Missing <code>Options.prototype.constructor</code>,
      <code>BrotliOptions.prototype.constructor</code>,
      <code>BrotliDecompress.prototype.constructor</code>,
      <code>ZlibBase.prototype.constructor</code>.
    </p>
  </td>
</tr>

</table>

## Globals

This is the list of Node globals that Deno supports.

These globals are only available in the `npm` package scope. In your own code
you can use them by importing them from the relevant `node:` module.

| Global name                                                                                                      | Status |
| ---------------------------------------------------------------------------------------------------------------- | ------ |
| [`AbortController`](https://nodejs.org/api/globals.html#class-abortcontroller)                                   | ✅     |
| [`AbortSignal`](https://nodejs.org/api/globals.html#class-abortsignal)                                           | ✅     |
| [`Blob`](https://nodejs.org/api/globals.html#class-blob)                                                         | ✅     |
| [`Buffer`](https://nodejs.org/api/globals.html#class-buffer)                                                     | ✅     |
| [`ByteLengthQueuingStrategy`](https://nodejs.org/api/globals.html#class-bytelengthqueuingstrategy)               | ✅     |
| [`__dirname`](https://nodejs.org/api/globals.html#__dirname)                                                     | ✅     |
| [`__filename`](https://nodejs.org/api/globals.html#__filename)                                                   | ✅     |
| [`atob`](https://nodejs.org/api/globals.html#atobdata)                                                           | ✅     |
| [`BroadcastChannel`](https://nodejs.org/api/globals.html#broadcastchannel)                                       | ✅     |
| [`btoa`](https://nodejs.org/api/globals.html#btoadata)                                                           | ✅     |
| [`clearImmediate`](https://nodejs.org/api/globals.html#clearimmediateimmediateobject)                            | ✅     |
| [`clearInterval`](https://nodejs.org/api/globals.html#clearintervalintervalobject)                               | ✅     |
| [`clearTimeout`](https://nodejs.org/api/globals.html#cleartimeouttimeoutobject)                                  | ✅     |
| [`CompressionStream`](https://nodejs.org/api/globals.html#class-compressionstream)                               | ✅     |
| [`console`](https://nodejs.org/api/globals.html#console)                                                         | ✅     |
| [`CountQueuingStrategy`](https://nodejs.org/api/globals.html#class-countqueuingstrategy)                         | ✅     |
| [`Crypto`](https://nodejs.org/api/globals.html#crypto)                                                           | ✅     |
| [`CryptoKey`](https://nodejs.org/api/globals.html#cryptokey)                                                     | ✅     |
| [`CustomEvent`](https://nodejs.org/api/globals.html#customevent)                                                 | ✅     |
| [`CustomEvent`](https://nodejs.org/api/globals.html#customevent)                                                 | ✅     |
| [`DecompressionStream`](https://nodejs.org/api/globals.html#class-decompressionstream)                           | ✅     |
| [`Event`](https://nodejs.org/api/globals.html#event)                                                             | ✅     |
| [`EventTarget`](https://nodejs.org/api/globals.html#eventtarget)                                                 | ✅     |
| [`exports`](https://nodejs.org/api/globals.html#exports)                                                         | ✅     |
| [`fetch`](https://nodejs.org/api/globals.html#fetch)                                                             | ✅     |
| [`fetch`](https://nodejs.org/api/globals.html#fetch)                                                             | ✅     |
| [`File`](https://nodejs.org/api/globals.html#class-file)                                                         | ✅     |
| [`File`](https://nodejs.org/api/globals.html#class-file)                                                         | ✅     |
| [`FormData`](https://nodejs.org/api/globals.html#class-formdata)                                                 | ✅     |
| [`global`](https://nodejs.org/api/globals.html#global)                                                           | ✅     |
| [`Headers`](https://nodejs.org/api/globals.html#class-headers)                                                   | ✅     |
| [`MessageChannel`](https://nodejs.org/api/globals.html#messagechannel)                                           | ✅     |
| [`MessageEvent`](https://nodejs.org/api/globals.html#messageevent)                                               | ✅     |
| [`MessagePort`](https://nodejs.org/api/globals.html#messageport)                                                 | ✅     |
| [`module`](https://nodejs.org/api/globals.html#module)                                                           | ✅     |
| [`PerformanceEntry`](https://nodejs.org/api/globals.html#performanceentry)                                       | ✅     |
| [`PerformanceMark`](https://nodejs.org/api/globals.html#performancemark)                                         | ✅     |
| [`PerformanceMeasure`](https://nodejs.org/api/globals.html#performancemeasure)                                   | ✅     |
| [`PerformanceObserver`](https://nodejs.org/api/globals.html#performanceobserver)                                 | ✅     |
| [`PerformanceObserverEntryList`](https://nodejs.org/api/globals.html#performanceobserverentrylist)               | ❌     |
| [`PerformanceResourceTiming`](https://nodejs.org/api/globals.html#performanceresourcetiming)                     | ❌     |
| [`performance`](https://nodejs.org/api/globals.html#performance)                                                 | ✅     |
| [`process`](https://nodejs.org/api/globals.html#process)                                                         | ✅     |
| [`queueMicrotask`](https://nodejs.org/api/globals.html#queuemicrotaskcallback)                                   | ✅     |
| [`ReadableByteStreamController`](https://nodejs.org/api/globals.html#class-readablebytestreamcontroller)         | ✅     |
| [`ReadableStream`](https://nodejs.org/api/globals.html#class-readablestream)                                     | ✅     |
| [`ReadableStreamBYOBReader`](https://nodejs.org/api/globals.html#class-readablestreambyobreader)                 | ✅     |
| [`ReadableStreamBYOBRequest`](https://nodejs.org/api/globals.html#class-readablestreambyobrequest)               | ✅     |
| [`ReadableStreamDefaultController`](https://nodejs.org/api/globals.html#class-readablestreamdefaultcontroller)   | ✅     |
| [`ReadableStreamDefaultReader`](https://nodejs.org/api/globals.html#class-readablestreamdefaultreader)           | ✅     |
| [`require`](https://nodejs.org/api/globals.html#require)                                                         | ✅     |
| [`Response`](https://nodejs.org/api/globals.html#response)                                                       | ✅     |
| [`Request`](https://nodejs.org/api/globals.html#request)                                                         | ✅     |
| [`setImmediate`](https://nodejs.org/api/globals.html#setimmediatecallback-args)                                  | ✅     |
| [`setInterval`](https://nodejs.org/api/globals.html#setintervalcallback-delay-args)                              | ✅     |
| [`setTimeout`](https://nodejs.org/api/globals.html#settimeoutcallback-delay-args)                                | ✅     |
| [`structuredClone`](https://nodejs.org/api/globals.html#structuredclonevalue-options)                            | ✅     |
| [`structuredClone`](https://nodejs.org/api/globals.html#structuredclonevalue-options)                            | ✅     |
| [`SubtleCrypto`](https://nodejs.org/api/globals.html#subtlecrypto)                                               | ✅     |
| [`DOMException`](https://nodejs.org/api/globals.html#domexception)                                               | ✅     |
| [`TextDecoder`](https://nodejs.org/api/globals.html#textdecoder)                                                 | ✅     |
| [`TextDecoderStream`](https://nodejs.org/api/globals.html#class-textdecoderstream)                               | ✅     |
| [`TextEncoder`](https://nodejs.org/api/globals.html#textencoder)                                                 | ✅     |
| [`TextEncoderStream`](https://nodejs.org/api/globals.html#class-textencoderstream)                               | ✅     |
| [`TransformStream`](https://nodejs.org/api/globals.html#class-transformstream)                                   | ✅     |
| [`TransformStreamDefaultController`](https://nodejs.org/api/globals.html#class-transformstreamdefaultcontroller) | ✅     |
| [`URL`](https://nodejs.org/api/globals.html#url)                                                                 | ✅     |
| [`URLSearchParams`](https://nodejs.org/api/globals.html#urlsearchparams)                                         | ✅     |
| [`URLSearchParams`](https://nodejs.org/api/globals.html#urlsearchparams)                                         | ✅     |
| [`WebAssembly`](https://nodejs.org/api/globals.html#webassembly)                                                 | ✅     |
| [`WritableStream`](https://nodejs.org/api/globals.html#class-writablestream)                                     | ✅     |
| [`WritableStreamDefaultController`](https://nodejs.org/api/globals.html#class-writablestreamdefaultcontroller)   | ✅     |
| [`WritableStreamDefaultWriter`](https://nodejs.org/api/globals.html#class-writablestreamdefaultwriter)           | ✅     |
