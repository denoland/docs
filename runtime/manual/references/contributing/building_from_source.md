# Building `deno` from Source

Below are instructions on how to build Deno from source. If you just want to use
Deno you can download a prebuilt executable (more information in the
[`Getting Started`](../../getting_started/installation.md#download-and-install)
chapter).

## Cloning the Repository

> Deno uses submodules, so you must remember to clone using
> `--recurse-submodules`.

**Linux(Debian)**/**Mac**/**WSL**:

```shell
git clone --recurse-submodules https://github.com/denoland/deno.git
```

**Windows**:

1. [Enable "Developer Mode"](https://www.google.com/search?q=windows+enable+developer+mode)
   (otherwise symlinks would require administrator privileges).
2. Make sure you are using git version 2.19.2.windows.1 or newer.
3. Set `core.symlinks=true` before the checkout:
   ```shell
   git config --global core.symlinks true
   git clone --recurse-submodules https://github.com/denoland/deno.git
   ```

## Prerequisites

### Rust

> Deno requires a specific release of Rust. Deno may not support building on
> other versions, or on the Rust Nightly Releases. The version of Rust required
> for a particular release is specified in the `rust-toolchain.toml` file.

[Update or Install Rust](https://www.rust-lang.org/tools/install). Check that
Rust installed/updated correctly:

```console
rustc -V
cargo -V
```

### Native Compilers and Linkers

> Many components of Deno require a native compiler to build optimized native
> functions.

**Linux(Debian)/WSL**

```shell
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
./llvm.sh 16
apt install --install-recommends -y cmake libglib2.0-dev
```

**Mac**:

Mac users must have the _XCode Command Line Tools_ installed.
([XCode](https://developer.apple.com/xcode/) already includes the _XCode Command
Line Tools_. Run `xcode-select --install` to install it without XCode.)

[CMake](https://cmake.org/) is also required, but does not ship with the
_Command Line Tools_.

```console
brew install cmake
```

**Mac M1/M2**:

For Apple aarch64 users `lld` must be installed.

```console
brew install llvm
# Add /opt/homebrew/opt/llvm/bin/ to $PATH
```

**Windows**:

1. Get [VS Community 2019](https://www.visualstudio.com/downloads/) with the
   "Desktop development with C++" toolkit and make sure to select the following
   required tools listed below along with all C++ tools.

   - Visual C++ tools for CMake
   - Windows 10 SDK (10.0.17763.0)
   - Testing tools core features - Build Tools
   - Visual C++ ATL for x86 and x64
   - Visual C++ MFC for x86 and x64
   - C++/CLI support
   - VC++ 2015.3 v14.00 (v140) toolset for desktop

2. Enable "Debugging Tools for Windows".
   - Go to "Control Panel" → "Programs" → "Programs and Features"
   - Select "Windows Software Development Kit - Windows 10"
   - → "Change" → "Change" → Check "Debugging Tools For Windows" → "Change"
     →"Finish".
   - Or use:
     [Debugging Tools for Windows](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/)
     (Notice: it will download the files, you should install
     `X64 Debuggers And Tools-x64_en-us.msi` file manually.)

### Protobuf Compiler

> Building Deno requires the
> [Protocol Buffers compiler](https://grpc.io/docs/protoc-installation/).

**Linux(Debian)**/**WSL**:

```sh
apt install -y protobuf-compiler
protoc --version  # Ensure compiler version is 3+
```

**Mac**:

```sh
brew install protobuf
protoc --version  # Ensure compiler version is 3+
```

**Windows**

Windows users can download the latest binary release from
[GitHub](https://github.com/protocolbuffers/protobuf/releases/latest).

## Python 3

> Deno requires [Python 3](https://www.python.org/downloads) for running WPT
> tests. Ensure that a suffix-less `python`/`python.exe` exists in your `PATH`
> and it refers to Python 3.

## Building Deno

The easiest way to build Deno is by using a precompiled version of V8:

> for WSL make sure you have sufficient memory allocated in .wslconfig

```console
cargo build -vv
```

However, you may also want to build Deno and V8 from source code if you are
doing lower-level V8 development, or using a platform that does not have
precompiled versions of V8:

```console
V8_FROM_SOURCE=1 cargo build -vv
```

When building V8 from source, there may be more dependencies. See
[rusty_v8's README](https://github.com/denoland/rusty_v8) for more details about
the V8 build.

## Building

Build with Cargo:

```shell
# Build:
cargo build -vv

# Build errors?  Ensure you have latest main and try building again, or if that doesn't work try:
cargo clean && cargo build -vv

# Run:
./target/debug/deno run cli/tests/testdata/run/002_hello.ts
```
