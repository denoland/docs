---
title: "CPU profiling"
description: "Profile Deno programs with the built-in CPU profiler: collecting profiles, Markdown and flamegraph reports, Chrome DevTools analysis, and profiling tips."
---

Deno includes built-in support for V8 CPU profiling, which helps you identify
performance bottlenecks in your code. Use the `--cpu-prof` flag to capture a CPU
profile during program execution:

```sh
deno run --cpu-prof your_script.ts
# or with deno eval
deno eval --cpu-prof "for (let i = 0; i < 1e8; i++) {}"
```

When your program exits, Deno will write a `.cpuprofile` file to the current
directory (e.g., `CPU.1769017882255.25986.cpuprofile`). This file can be loaded
into Chrome DevTools (Performance tab) or other V8 profile viewers for analysis.

## CPU profiling flags

| Flag                                 | Description                                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `--cpu-prof`                         | Enable CPU profiling. Profile is written to disk on exit.                                                        |
| `--cpu-prof-dir=<DIR>`               | Directory where the CPU profile will be written. Defaults to current directory. Implicitly enables `--cpu-prof`. |
| `--cpu-prof-name=<NAME>`             | Filename for the CPU profile. Defaults to `CPU.<timestamp>.<pid>.cpuprofile`.                                    |
| `--cpu-prof-interval=<MICROSECONDS>` | Sampling interval in microseconds. Default is `1000` (1ms). Lower values give more detail but larger files.      |
| `--cpu-prof-md`                      | Generate a human-readable Markdown report alongside the `.cpuprofile` file.                                      |
| `--cpu-prof-flamegraph`              | Generate an interactive SVG flamegraph alongside the `.cpuprofile` file.                                         |

:::note

CPU profiles report line numbers from the transpiled JavaScript code, not the
original TypeScript source. This is a limitation of V8's profiler. For
TypeScript files, the reported line numbers may not match your source code
directly.

:::

## Customizing profile output

By default, profiles are written to the current directory with an auto-generated
filename. You can control where and how profiles are saved:

```sh
# Save profiles to a specific directory
deno run --cpu-prof --cpu-prof-dir=./profiles your_script.ts

# Use a custom filename
deno run --cpu-prof --cpu-prof-name=my-profile.cpuprofile your_script.ts

# Increase sampling frequency for more detail (default: 1000μs)
deno run --cpu-prof --cpu-prof-interval=100 your_script.ts
```

A lower `--cpu-prof-interval` captures more samples per second, giving finer
granularity at the cost of larger profile files. The default of `1000`
microseconds (1ms) is a good balance for most use cases. For short-lived
functions you want to capture in detail, try `100` (0.1ms).

## Analyzing profiles in Chrome DevTools

To analyze the `.cpuprofile` file:

1. Open Chrome DevTools (F12)
2. Go to the **Performance** tab
3. Click the **Load profile** button (up arrow icon)
4. Select your `.cpuprofile` file

The DevTools will display a flame chart and detailed breakdown of where time was
spent in your application.

## Example: Markdown report

The `--cpu-prof-md` flag generates a Markdown summary that's easy to read
without loading the profile into DevTools:

```sh
deno run -A --cpu-prof --cpu-prof-md server.js
```

This creates both a `.cpuprofile` file and a `.md` file with a report like:

```md
# CPU Profile

| Duration | Samples | Interval | Functions |
| -------- | ------- | -------- | --------- |
| 833.06ms | 641     | 1000us   | 10        |

**Top 10:** `op_crypto_get_random_values` 98.5%, `(garbage collector)` 0.7%,
`getRandomValues` 0.6%, `assertBranded` 0.2%

## Hot Functions (Self Time)

| Self% |     Self | Total% |    Total | Function                      | Location          |
| ----: | -------: | -----: | -------: | ----------------------------- | ----------------- |
| 98.5% | 533.00ms |  98.5% | 533.00ms | `op_crypto_get_random_values` | [native code]     |
|  0.7% |   4.00ms |   0.7% |   4.00ms | `(garbage collector)`         | [native code]     |
|  0.6% |   3.00ms |   0.6% |   3.00ms | `getRandomValues`             | 00_crypto.js:5274 |
|  0.2% |   1.00ms |   0.2% |   1.00ms | `assertBranded`               | 00_webidl.js:1149 |

## Call Tree (Total Time)

| Total% |    Total | Self% |     Self | Function                      | Location          |
| -----: | -------: | ----: | -------: | ----------------------------- | ----------------- |
|  16.8% |  91.00ms | 16.8% |  91.00ms | `(anonymous)`                 | server.js:1       |
|   0.6% |   3.00ms |  0.6% |   3.00ms | `getRandomValues`             | 00_crypto.js:5274 |
|  98.5% | 533.00ms | 98.5% | 533.00ms | `op_crypto_get_random_values` | [native code]     |

## Function Details

## `op_crypto_get_random_values`

[native code] | Self: 98.5% (533.00ms) | Total: 98.5% (533.00ms) | Samples: 533
```

The report includes:

- **Summary**: Total duration, sample count, sampling interval, and function
  count
- **Top 10**: Quick overview of the most expensive functions
- **Hot Functions**: Functions sorted by self time (time spent in the function
  itself, excluding callees)
- **Call Tree**: Hierarchical view showing the call stack and time distribution
- **Function Details**: Per-function breakdown with sample counts

## Example: Interactive flamegraph

The `--cpu-prof-flamegraph` flag generates a self-contained, interactive SVG
flamegraph that you can open directly in a browser — no external tools required:

```sh
deno run --cpu-prof --cpu-prof-flamegraph your_script.ts
```

This creates both a `.cpuprofile` file and an `.svg` file. Open the SVG in any
browser to explore the profile interactively:

- **Click** any frame to zoom into that subtree
- **Reset Zoom** button to restore the full view
- **Ctrl+F** or the **Search** button for regex-based function search with
  highlighting and matched percentage
- **Invert** checkbox to flip into an icicle graph (root at top)
- **Hover** any frame to see the function name and sample count

The flamegraph also works with `deno eval`:

```sh
deno eval --cpu-prof --cpu-prof-flamegraph "for (let i = 0; i < 1e8; i++) {}"
```

## Profiling tips

- **Profile representative workloads**: For HTTP servers, send realistic traffic
  to the server before stopping it — the profile only captures what happens
  while the program is running.
- **Use self time vs. total time**: In profile reports, _self time_ is time
  spent in a function's own code, while _total time_ includes time in functions
  it calls. High self time points to the actual bottleneck; high total time with
  low self time means the function delegates to something expensive.
- **Compare before and after**: Save profiles with descriptive `--cpu-prof-name`
  values (e.g., `before-optimization.cpuprofile`) so you can compare profiles
  side-by-side in DevTools after making changes.
- **Combine output formats**: You can use `--cpu-prof-md` and
  `--cpu-prof-flamegraph` together to get all three outputs (`.cpuprofile`,
  `.md`, and `.svg`) in a single run:
  ```sh
  deno run --cpu-prof --cpu-prof-md --cpu-prof-flamegraph your_script.ts
  ```
- **Filter out noise**: Short-lived programs may show startup overhead (module
  loading, JIT compilation) dominating the profile. For more accurate results,
  ensure the code you want to profile runs long enough to collect meaningful
  samples.
