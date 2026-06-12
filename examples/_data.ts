// The examples catalog. Items are declared flat; rendering order is
// controlled by categoryOrder below, and items inside each category are
// sorted alphabetically at build time. To add an item, append it
// anywhere in this list with the right category.
export const items = [
  // Basics
  {
    title: "What is Deno?",
    href: "/examples/what_is_deno/",
    externalURL:
      "https://www.youtube.com/watch?v=KPTOo4k8-GE&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe",
    type: "video",
    category: "Basics",
  },
  {
    title: "Run a script",
    href: "/examples/run_script_tutorial/",
    type: "tutorial",
    category: "Basics",
  },
  {
    title: "Hello World",
    href: "/examples/hello_world/",
    type: "example",
    category: "Basics",
  },
  {
    title: "Built in TypeScript support",
    href: "/examples/typescript_support/",
    type: "example",
    category: "Basics",
  },
  {
    title: "Your Deno Dev Environment",
    href: "/examples/deno_dev_environment/",
    externalURL:
      "https://www.youtube.com/watch?v=BFfrGrLm2tw&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=3",
    type: "video",
    category: "Basics",
  },
  {
    title: "Initialize a project",
    href: "/examples/initialize_project_tutorial/",
    type: "tutorial",
    category: "Basics",
  },
  {
    title: "Executable scripts",
    href: "/examples/hashbang_tutorial/",
    type: "tutorial",
    category: "Basics",
  },
  {
    title: "All-in-one tooling",
    href: "/examples/all-in-one_tooling/",
    externalURL:
      "https://www.youtube.com/watch?v=-4e9DkUrCr4&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=5",
    type: "video",
    category: "Basics",
  },
  {
    title: "Tasks and configuration with deno.json",
    href: "/examples/configuration_with_deno_json/",
    externalURL:
      "https://www.youtube.com/watch?v=bTmO5Tfgke4&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=10",
    type: "video",
    category: "Basics",
  },
  {
    title: "Top level await",
    href: "/examples/top_level_await/",
    type: "example",
    category: "Basics",
  },
  {
    title: "Sleep and delay execution",
    href: "/examples/sleep_delay/",
    type: "example",
    category: "Basics",
  },
  {
    title: "Check if two values are deeply equal",
    href: "/examples/deep_equal/",
    type: "example",
    category: "Basics",
  },
  {
    title: "Update from CommonJS to ESM",
    href: "/examples/cjs_to_esm_tutorial/",
    type: "tutorial",
    category: "Basics",
  },
  {
    title: "Import and export functions",
    href: "/examples/import_export/",
    type: "example",
    category: "Basics",
  },
  {
    title: "Interoperability with Node.js",
    href: "/examples/interoperability_with_nodejs/",
    externalURL:
      "https://www.youtube.com/watch?v=mgX1ymfqPSQ&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=2",
    type: "video",
    category: "Basics",
  },
  {
    title: "Introduction to Deno APIs",
    href: "/examples/intro_to_deno_apis/",
    externalURL:
      "https://www.youtube.com/watch?v=p28ujFMrdA0&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=7",
    type: "video",
    category: "Basics",
  },
  {
    title: "Simple API server",
    href: "/examples/simple_api_tutorial/",
    type: "tutorial",
    category: "Basics",
  },
  {
    title: "Simple file server",
    href: "/examples/file_server_tutorial/",
    type: "tutorial",
    category: "Basics",
  },
  {
    title: "Formatting with Deno fmt",
    href: "/examples/deno_fmt/",
    externalURL: "https://www.youtube.com/watch?v=Ouzso9gQqnc",
    type: "video",
    category: "Basics",
  },
  {
    title: "Benchmarking with Deno bench",
    href: "/examples/deno_bench/",
    externalURL: "https://www.youtube.com/watch?v=IVde_GTN6TM",
    type: "video",
    category: "Basics",
  },
  {
    title: "Sharing your local server with tunnel",
    href: "/examples/tunnel_tutorial/",
    type: "tutorial",
    category: "Basics",
  },
  {
    title: "Generating documentation with deno doc",
    href: "/examples/deno_doc_tutorial/",
    type: "tutorial",
    category: "Basics",
  },

  // Modules and package management
  {
    title: "Use Node.js built-in modules",
    href: "/examples/node_built_in/",
    type: "example",
    category: "Modules and package management",
  },
  {
    title: "Import modules from npm",
    href: "/examples/npm/",
    type: "example",
    category: "Modules and package management",
  },
  {
    title: "Compatibility with Node & npm",
    href: "/examples/backward_compat_with_node_npm/",
    externalURL:
      "https://www.youtube.com/watch?v=QPLchkJ7eas&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=12",
    type: "video",
    category: "Modules and package management",
  },
  {
    title: "ECMAScript Modules",
    href: "/examples/esmodules/",
    externalURL:
      "https://www.youtube.com/watch?v=cTFBiwYY3vs&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=9",
    type: "video",
    category: "Modules and package management",
  },
  {
    title: "Publishing Modules with JSR",
    href: "/examples/publishing_modules_with_jsr/",
    externalURL:
      "https://www.youtube.com/watch?v=7uiL4WYvZVs&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=8",
    type: "video",
    category: "Modules and package management",
  },
  {
    title: "Add and remove dependencies",
    href: "/examples/add_remove_dependencies_tutorial/",
    type: "tutorial",
    category: "Modules and package management",
  },
  {
    title: "Lock dependencies with deno.lock",
    href: "/examples/dependency_lockfile_tutorial/",
    type: "tutorial",
    category: "Modules and package management",
  },
  {
    title: "Use private npm registries",
    href: "/examples/private_registries_tutorial/",
    type: "tutorial",
    category: "Modules and package management",
  },
  {
    title: "Run npm lifecycle scripts",
    href: "/examples/npm_lifecycle_scripts_tutorial/",
    type: "tutorial",
    category: "Modules and package management",
  },
  {
    title: "Use local and unpublished packages",
    href: "/examples/local_unpublished_packages_tutorial/",
    type: "tutorial",
    category: "Modules and package management",
  },
  {
    title: "Configure a monorepo with workspaces",
    href: "/examples/workspaces_monorepo_tutorial/",
    type: "tutorial",
    category: "Modules and package management",
  },
  {
    title: "Run Deno in GitHub Actions",
    href: "/examples/deno_github_actions_tutorial/",
    type: "tutorial",
    category: "Modules and package management",
  },
  {
    title: "Use Deno in an existing Node.js project",
    href: "/examples/migrate_node_project_tutorial/",
    type: "tutorial",
    category: "Modules and package management",
  },
  {
    title: "Module Metadata",
    href: "/examples/module_metadata_tutorial/",
    type: "tutorial",
    category: "Modules and package management",
  },

  // Network
  {
    title: "HTTP requests",
    href: "/examples/http_requests/",
    type: "example",
    category: "Network",
  },
  {
    title: "HTTP Server: Hello world",
    href: "/examples/http_server/",
    type: "example",
    category: "Network",
  },
  {
    title: "HTTP server: Routing",
    href: "/examples/http_server_routing/",
    type: "example",
    category: "Network",
  },
  {
    title: "HTTP server: Serving files",
    href: "/examples/http_server_files/",
    type: "example",
    category: "Network",
  },
  {
    title: "HTTP server: Streaming",
    href: "/examples/http_server_streaming/",
    type: "example",
    category: "Network",
  },
  {
    title: "HTTP server: Server-sent events",
    href: "/examples/http_server_sse/",
    type: "example",
    category: "Network",
  },
  {
    title: "HTTP server: TLS",
    href: "/examples/http_server_tls/",
    type: "example",
    category: "Network",
  },
  {
    title: "HTTP server: Hot reload",
    href: "/examples/http_server_hot_reload/",
    type: "example",
    category: "Network",
  },
  {
    title: "HTTP server: Scaling across CPU cores",
    href: "/examples/http_server_parallel/",
    type: "example",
    category: "Network",
  },
  {
    title: "HTTP server: Node.js streams",
    href: "/examples/http_server_node_streams/",
    type: "example",
    category: "Network",
  },
  {
    title: "Proxy HTTP requests",
    href: "/examples/http_proxy/",
    type: "example",
    category: "Network",
  },
  {
    title: "Fetch over a Unix socket",
    href: "/examples/fetch_unix_socket/",
    type: "example",
    category: "Network",
  },
  {
    title: "HTTP server: CRUD with SQLite3",
    href: "/examples/http_server_oak_crud_middleware_with_sqlite3_db/",
    type: "example",
    category: "Network",
  },
  {
    title: "Hono HTTP server",
    href: "/examples/hono/",
    type: "example",
    category: "Network",
  },
  {
    title: "HTTP server: WebSockets",
    href: "/examples/http_server_websocket/",
    type: "example",
    category: "Network",
  },
  {
    title: "Piping streams",
    href: "/examples/piping_streams/",
    type: "example",
    category: "Network",
  },
  {
    title: "Outbound WebSockets",
    href: "/examples/websocket/",
    type: "example",
    category: "Network",
  },
  {
    title: "TCP Echo Server",
    href: "/examples/tcp_echo_server/",
    type: "example",
    category: "Network",
  },
  {
    title: "TCP connector: Ping",
    href: "/examples/tcp_connector/",
    type: "example",
    category: "Network",
  },
  {
    title: "TCP listener: Ping",
    href: "/examples/tcp_listener/",
    type: "example",
    category: "Network",
  },
  {
    title: "TCP/TLS connector: Ping",
    href: "/examples/tls_connector/",
    type: "example",
    category: "Network",
  },
  {
    title: "TCP/TLS listener: Ping",
    href: "/examples/tls_listener/",
    type: "example",
    category: "Network",
  },
  {
    title: "Running DNS queries",
    href: "/examples/dns_queries/",
    type: "example",
    category: "Network",
  },
  {
    title: "File Based Routing",
    href: "/examples/file_based_routing_tutorial/",
    type: "tutorial",
    category: "Network",
  },
  {
    title: "Build a chat app with WebSockets",
    href: "/examples/chat_app_tutorial/",
    type: "tutorial",
    category: "Network",
  },
  {
    title: "Build a Realtime WebSocket Application",
    href: "/examples/realtime_websocket_app/",
    externalURL:
      "https://www.youtube.com/watch?v=FC4IrkHEg4A&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=15",
    type: "video",
    category: "Network",
  },
  {
    title: "UDP listener: Ping",
    href: "/examples/udp_listener/",
    type: "example",
    category: "Network",
  },
  {
    title: "UDP connector: Ping",
    href: "/examples/udp_connector/",
    type: "example",
    category: "Network",
  },

  // File system
  {
    title: "Path operations",
    href: "/examples/path_operations/",
    type: "example",
    category: "File system",
  },
  {
    title: "Convert between file URLs and paths",
    href: "/examples/file_url_path/",
    type: "example",
    category: "File system",
  },
  {
    title: "Get the MIME type of a file",
    href: "/examples/mime_type/",
    type: "example",
    category: "File system",
  },
  {
    title: "Copy a file",
    href: "/examples/copy_file/",
    type: "example",
    category: "File system",
  },
  {
    title: "Write a file incrementally",
    href: "/examples/write_file_incremental/",
    type: "example",
    category: "File system",
  },
  {
    title: "Reading files",
    href: "/examples/reading_files/",
    type: "example",
    category: "File system",
  },
  {
    title: "Writing files",
    href: "/examples/writing_files/",
    type: "example",
    category: "File system",
  },
  {
    title: "Deleting files",
    href: "/examples/deleting_files/",
    type: "example",
    category: "File system",
  },
  {
    title: "Checking for file existence",
    href: "/examples/checking_file_existence/",
    type: "example",
    category: "File system",
  },
  {
    title: "Moving/Renaming files",
    href: "/examples/moving_renaming_files/",
    type: "example",
    category: "File system",
  },
  {
    title: "Creating & removing directories",
    href: "/examples/create_remove_directories/",
    type: "example",
    category: "File system",
  },
  {
    title: "Watching the filesystem",
    href: "/examples/watching_files/",
    type: "example",
    category: "File system",
  },
  {
    title: "Walking directories",
    href: "/examples/walking_directories/",
    type: "example",
    category: "File system",
  },
  {
    title: "Unix cat",
    href: "/examples/unix_cat/",
    type: "example",
    category: "File system",
  },
  {
    title: "Creating & resolving symlinks",
    href: "/examples/symlinks/",
    type: "example",
    category: "File system",
  },
  {
    title: "Temporary files & directories",
    href: "/examples/temporary_files/",
    type: "example",
    category: "File system",
  },
  {
    title: "Streaming file operations",
    href: "/examples/streaming_files/",
    type: "example",
    category: "File system",
  },
  {
    title: "File system events",
    href: "/examples/file_system_events_tutorial/",
    type: "tutorial",
    category: "File system",
  },

  // System
  {
    title: "Handling OS signals",
    href: "/examples/os_signals/",
    type: "example",
    category: "System",
  },
  {
    title: "Benchmarking",
    href: "/examples/benchmarking/",
    type: "example",
    category: "System",
  },
  {
    title: "Create a subprocess",
    href: "/examples/subprocess_tutorial/",
    type: "tutorial",
    category: "System",
  },
  {
    title: "Subprocess Spawning",
    href: "/examples/subprocess_running_files/",
    type: "example",
    category: "System",
  },
  {
    title: "Collecting output from subprocesses",
    href: "/examples/subprocesses_output/",
    type: "example",
    category: "System",
  },
  {
    title: "Reading system metrics",
    href: "/examples/reading_system_metrics/",
    type: "example",
    category: "System",
  },
  {
    title: "Process information",
    href: "/examples/pid/",
    type: "example",
    category: "System",
  },
  {
    title: "Read from stdin",
    href: "/examples/reading_stdin/",
    type: "example",
    category: "System",
  },
  {
    title: "Write to stdout",
    href: "/examples/write_stdout/",
    type: "example",
    category: "System",
  },
  {
    title: "Communicate with a child process over IPC",
    href: "/examples/child_process_ipc/",
    type: "example",
    category: "System",
  },
  {
    title: "Environment variables",
    href: "/examples/environment_variables/",
    type: "example",
    category: "System",
  },
  {
    title: "Subprocesses: Spawning",
    href: "/examples/subprocesses_spawn/",
    type: "example",
    category: "System",
  },
  {
    title: "Handle OS signals",
    href: "/examples/os_signals_tutorial/",
    type: "tutorial",
    category: "System",
  },

  // Web standard APIs
  {
    title: "Browser APIs in Deno",
    href: "/examples/browser_apis_in_deno/",
    externalURL:
      "https://www.youtube.com/watch?v=oxVwTT-rZRo&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=6",
    type: "video",
    category: "Web standard APIs",
  },
  {
    title: "Temporal API",
    href: "/examples/temporal/",
    type: "example",
    category: "Web standard APIs",
  },
  {
    title: "Better debugging with the console API",
    href: "/examples/debugging_with_console_tutorial/",
    type: "tutorial",
    category: "Web standard APIs",
  },
  {
    title: "Manipulating & parsing URLs",
    href: "/examples/url_parsing/",
    type: "example",
    category: "Web standard APIs",
  },
  {
    title: "Escape an HTML string",
    href: "/examples/escape_html/",
    type: "example",
    category: "Web standard APIs",
  },
  {
    title: "Fetch and stream data",
    href: "/examples/fetch_data_tutorial/",
    type: "tutorial",
    category: "Web standard APIs",
  },
  {
    title: "Set timeout and intervals",
    href: "/examples/timers/",
    type: "example",
    category: "Web standard APIs",
  },
  {
    title: "Logging with colors",
    href: "/examples/color_logging/",
    type: "example",
    category: "Web standard APIs",
  },
  {
    title: "Web workers",
    href: "/examples/web_workers/",
    type: "example",
    category: "Web standard APIs",
  },
  {
    title: "Web assembly",
    href: "/examples/webassembly/",
    type: "example",
    category: "Web standard APIs",
  },

  // Standard library
  {
    title: "User Data Processing with Deno Collections",
    href: "/examples/data_processing/",
    type: "example",
    category: "Standard library",
  },
  {
    title: "Exponential backoff",
    href: "/examples/exponential_backoff/",
    type: "example",
    category: "Standard library",
  },

  // Encoding
  {
    title: "Hex and base64 encoding",
    href: "/examples/hex_base64_encoding/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Parsing and serializing TOML",
    href: "/examples/parsing_serializing_toml/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Importing JSON",
    href: "/examples/importing_json/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Byte and text imports",
    href: "/examples/byte_and_text_imports/",
    externalURL: "https://www.youtube.com/watch?v=PAEI6mdlXwc",
    type: "video",
    category: "Encoding",
  },
  {
    title: "Image bundling with deno compile",
    href: "/examples/image_bundling_deno_compile/",
    externalURL: "https://www.youtube.com/watch?v=qg_M0deBlfQ",
    type: "video",
    category: "Encoding",
  },
  {
    title: "Parsing and serializing CSV",
    href: "/examples/parsing_serializing_csv/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Parsing and serializing JSON",
    href: "/examples/parsing_serializing_json/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Parsing and serializing YAML",
    href: "/examples/parsing_serializing_yaml/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Manipulating byte arrays",
    href: "/examples/byte_manipulation/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Convert an ArrayBuffer",
    href: "/examples/convert_arraybuffer/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Convert a Uint8Array",
    href: "/examples/convert_uint8array/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Convert a Blob",
    href: "/examples/convert_blob/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Convert a Buffer (node:buffer)",
    href: "/examples/convert_buffer/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Convert a ReadableStream",
    href: "/examples/convert_readablestream/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Convert a string to bytes and back",
    href: "/examples/convert_string/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Convert a Node.js Readable",
    href: "/examples/convert_node_readable/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Compress and decompress data",
    href: "/examples/compress_decompress/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Importing text",
    href: "/examples/importing_text/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Importing bytes",
    href: "/examples/importing_bytes/",
    type: "example",
    category: "Encoding",
  },

  // CLI
  {
    title: "Build a Command Line Utility",
    href: "/examples/command_line_utility/",
    externalURL:
      "https://www.youtube.com/watch?v=TUxj2TS5pNo&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=14",
    type: "video",
    category: "CLI",
  },
  {
    title: "Input prompts",
    href: "/examples/prompts/",
    type: "example",
    category: "CLI",
  },
  {
    title: "Permission management",
    href: "/examples/permissions/",
    type: "example",
    category: "CLI",
  },
  {
    title: "Command line arguments",
    href: "/examples/command_line_arguments/",
    type: "example",
    category: "CLI",
  },
  {
    title: "Getting the Deno version",
    href: "/examples/deno_version/",
    type: "example",
    category: "CLI",
  },

  // Cryptography
  {
    title: "Generating & validating UUIDs",
    href: "/examples/uuids/",
    type: "example",
    category: "Cryptography",
  },
  {
    title: "ULID",
    href: "/examples/ulid/",
    type: "example",
    category: "Cryptography",
  },
  {
    title: "Hashing",
    href: "/examples/hashing/",
    type: "example",
    category: "Cryptography",
  },
  {
    title: "Hashing and verifying passwords",
    href: "/examples/hash_password/",
    type: "example",
    category: "Cryptography",
  },
  {
    title: "RSASSA-PKCS1-v1_5 Signature and Verification",
    href: "/examples/rsa_signature/",
    type: "example",
    category: "Cryptography",
  },
  {
    title: "HMAC Generation and Verification",
    href: "/examples/hmac_generate_verify/",
    type: "example",
    category: "Cryptography",
  },
  {
    title: "AES Encryption and Decryption",
    href: "/examples/aes_encryption/",
    type: "example",
    category: "Cryptography",
  },

  // Testing
  {
    title: "Writing tests",
    href: "/examples/writing_tests/",
    type: "example",
    category: "Testing",
  },
  {
    title: "Basics of testing",
    href: "/examples/testing_tutorial/",
    type: "tutorial",
    category: "Testing",
  },
  {
    title: "Mocking data in tests",
    href: "/examples/mocking_tutorial/",
    type: "tutorial",
    category: "Testing",
  },
  {
    title: "Stubbing",
    href: "/examples/stubbing_tutorial/",
    type: "tutorial",
    category: "Testing",
  },
  {
    title: "Snapshot testing",
    href: "/examples/snapshot_test_tutorial/",
    type: "tutorial",
    category: "Testing",
  },
  {
    title: "Spy functions",
    href: "/examples/spy_functions/",
    type: "example",
    category: "Testing",
  },
  {
    title: "Getting started with Deno test",
    href: "/examples/deno_test/",
    externalURL: "https://www.youtube.com/watch?v=gDtDVfsgHgs",
    type: "video",
    category: "Testing",
  },
  {
    title: "Better testing with Deno coverage",
    href: "/examples/deno_coverage/",
    externalURL: "https://www.youtube.com/watch?v=P2BBYNPpgW8",
    type: "video",
    category: "Testing",
  },
  {
    title: "Testing web applications",
    href: "/examples/web_testing_tutorial/",
    type: "tutorial",
    category: "Testing",
  },
  {
    title: "BDD testing",
    href: "/examples/bdd_tutorial/",
    type: "tutorial",
    category: "Testing",
  },
  {
    title: "Skipping and focusing tests",
    href: "/examples/tests_skip_focus/",
    type: "example",
    category: "Testing",
  },
  {
    title: "Filtering and controlling test runs",
    href: "/examples/tests_run_control/",
    type: "example",
    category: "Testing",
  },
  {
    title: "Use Testing Library with Deno",
    href: "/examples/testing_library_tutorial/",
    type: "tutorial",
    category: "Testing",
  },

  // Web frameworks and libraries
  {
    title: "TypeScript and JSX",
    href: "/examples/ts_jsx/",
    externalURL:
      "https://www.youtube.com/watch?v=KoM8ahe8O74&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=11",
    type: "video",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a React App",
    href: "/examples/react_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a Next.js app",
    href: "/examples/next_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a Fresh app",
    href: "/examples/fresh_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a Svelte app",
    href: "/examples/svelte_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a Vue app",
    href: "/examples/vue_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "Use Express with Deno",
    href: "/examples/express_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "How to use Apollo with Deno",
    href: "/examples/apollo_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build an Astro site with Deno",
    href: "/examples/astro_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a Qwik app with Deno",
    href: "/examples/qwik_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a Nuxt app with Deno",
    href: "/examples/nuxt_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a Typesafe API with tRPC and Deno",
    href: "/examples/trpc_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build an API server with TypeScript",
    href: "/examples/build_api_server_ts/",
    externalURL:
      "https://www.youtube.com/watch?v=J8kZ-s-5-ms&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=13",
    type: "video",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a Vue app",
    href: "/examples/vue_app_video/",
    externalURL: "https://www.youtube.com/watch?v=MDPauM8fZDE",
    type: "video",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a SolidJS app",
    href: "/examples/solidjs_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a React app",
    href: "/examples/react_app_video/",
    externalURL: "https://www.youtube.com/watch?v=eStwt_2THd8",
    type: "video",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a Tanstack app",
    href: "/examples/tanstack_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },
  {
    title: "HTTP server file upload",
    href: "/examples/http_server_file_upload/",
    type: "example",
    category: "Web frameworks and libraries",
  },
  {
    title: "Build a word finder app",
    href: "/examples/word_finder_tutorial/",
    type: "tutorial",
    category: "Web frameworks and libraries",
  },

  // Databases
  {
    title: "Overview",
    href: "/examples/connecting_to_databases_tutorial/",
    type: "tutorial",
    category: "Databases",
  },
  {
    title: "MySQL",
    href: "/examples/mysql2_tutorial/",
    type: "tutorial",
    category: "Databases",
  },
  {
    title: "PlanetScale",
    href: "/examples/planetscale_tutorial/",
    type: "tutorial",
    category: "Databases",
  },
  {
    title: "Redis",
    href: "/examples/redis_tutorial/",
    type: "tutorial",
    category: "Databases",
  },
  {
    title: "Prisma",
    href: "/examples/prisma_tutorial/",
    type: "tutorial",
    category: "Databases",
  },
  {
    title: "Drizzle",
    href: "/examples/drizzle_tutorial/",
    type: "tutorial",
    category: "Databases",
  },
  {
    title: "Mongoose",
    href: "/examples/mongoose_tutorial/",
    type: "tutorial",
    category: "Databases",
  },
  {
    title: "Redis quick start",
    href: "/examples/redis/",
    type: "example",
    category: "Databases",
  },
  {
    title: "Postgres",
    href: "/examples/postgres/",
    type: "example",
    category: "Databases",
  },
  {
    title: "Supabase",
    href: "/examples/supabase/",
    type: "example",
    category: "Databases",
  },
  {
    title: "MongoDB",
    href: "/examples/mongo/",
    type: "example",
    category: "Databases",
  },
  {
    title: "SQLite",
    href: "/examples/sqlite/",
    type: "example",
    category: "Databases",
  },
  {
    title: "Mongoose (video)",
    href: "/examples/mongoose/",
    externalURL: "https://www.youtube.com/watch?v=dmZ9Ih0CR9g",
    type: "video",
    category: "Databases",
  },
  {
    title: "Prisma (video)",
    href: "/examples/prisma/",
    externalURL: "https://www.youtube.com/watch?v=P8VzA_XSF8w",
    type: "video",
    category: "Databases",
  },
  {
    title: "DuckDB",
    href: "/examples/duckdb/",
    type: "example",
    category: "Databases",
  },

  // Deno KV and scheduling
  {
    title: "Deno KV: Key/Value database",
    href: "/examples/kv/",
    type: "example",
    category: "Deno KV and scheduling",
  },
  {
    title: "Deno KV watch",
    href: "/examples/kv_watch/",
    type: "example",
    category: "Deno KV and scheduling",
  },
  {
    title: "Deno queues",
    href: "/examples/queues/",
    type: "example",
    category: "Deno KV and scheduling",
  },
  {
    title: "Deno Cron",
    href: "/examples/cron/",
    type: "example",
    category: "Deno KV and scheduling",
  },

  // AI
  {
    title: "LLM Chat app",
    href: "/examples/llm_tutorial/",
    type: "tutorial",
    category: "AI",
  },
  {
    title: "Connect to OpenAI - Chat completion",
    href: "/examples/openai_chat_completion/",
    type: "example",
    category: "AI",
  },

  // Deploying Deno projects
  {
    title: "Deploy with Deno Deploy",
    href: "/examples/deno_deploy_tutorial/",
    type: "tutorial",
    category: "Deploying Deno projects",
  },
  {
    title: "Deploy with the deploy command",
    href: "/examples/deploy_command_tutorial/",
    type: "tutorial",
    category: "Deploying Deno projects",
  },
  {
    title: "Migrating a custom domain to Deno Deploy",
    href: "/examples/migrate_custom_domain_tutorial/",
    type: "tutorial",
    category: "Deploying Deno projects",
  },
  {
    title: "Connecting to a database both locally and on Deno Deploy",
    href: "/examples/tunnel_database_tutorial/",
    type: "tutorial",
    category: "Deploying Deno projects",
  },
  {
    title: "AWS Lambda",
    href: "/examples/aws_lambda_tutorial/",
    type: "tutorial",
    category: "Deploying Deno projects",
  },
  {
    title: "Deploy Deno to AWS Lambda",
    href: "/examples/deploy_deno_to_aws_lambda/",
    externalURL:
      "https://www.youtube.com/watch?v=_xLOrT3cWK4&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=17",
    type: "video",
    category: "Deploying Deno projects",
  },
  {
    title: "AWS Lightsail",
    href: "/examples/aws_lightsail_tutorial/",
    type: "tutorial",
    category: "Deploying Deno projects",
  },
  {
    title: "Cloudflare workers",
    href: "/examples/cloudflare_workers_tutorial/",
    type: "tutorial",
    category: "Deploying Deno projects",
  },
  {
    title: "Cloudflare workers with wrangler",
    href: "/examples/cloudflare_workers_wrangler_tutorial/",
    type: "tutorial",
    category: "Deploying Deno projects",
  },
  {
    title: "Digital Ocean",
    href: "/examples/digital_ocean_tutorial/",
    type: "tutorial",
    category: "Deploying Deno projects",
  },
  {
    title: "Google Cloud Run",
    href: "/examples/google_cloud_run_tutorial/",
    type: "tutorial",
    category: "Deploying Deno projects",
  },
  {
    title: "Kinsta",
    href: "/examples/kinsta_tutorial/",
    type: "tutorial",
    category: "Deploying Deno projects",
  },
  {
    title: "Deploying Deno with Docker",
    href: "/examples/deploying_deno_with_docker/",
    externalURL:
      "https://www.youtube.com/watch?v=VRryNeYm6yw&list=PLvvLnBDNuTEov9EBIp3MMfHlBxaKGRWTe&index=16",
    type: "video",
    category: "Deploying Deno projects",
  },

  // OpenTelemetry
  {
    title: "Basic OpenTelemetry setup",
    href: "/examples/basic_opentelemetry_tutorial/",
    type: "tutorial",
    category: "OpenTelemetry",
  },
  {
    title: "Export telemetry to Grafana",
    href: "/examples/grafana_tutorial/",
    type: "tutorial",
    category: "OpenTelemetry",
  },
  {
    title: "Export telemetry to Hyperdx",
    href: "/examples/hyperdx_tutorial/",
    type: "tutorial",
    category: "OpenTelemetry",
  },
  {
    title: "View telemetry data for your local application",
    href: "/examples/tunnel_telemetry_tutorial/",
    type: "tutorial",
    category: "OpenTelemetry",
  },
  {
    title: "Export telemetry to Honeycomb",
    href: "/examples/honeycomb_tutorial/",
    type: "tutorial",
    category: "OpenTelemetry",
  },
  {
    title: "Span propagation",
    href: "/examples/otel_span_propagation_tutorial/",
    type: "tutorial",
    category: "OpenTelemetry",
  },
  {
    title: "OpenTelemetry with Deno Deploy",
    href: "/examples/deploy_otel_tutorial/",
    type: "tutorial",
    category: "OpenTelemetry",
  },

  // Deno Sandbox
  {
    title: "Evaluating JavaScript",
    href: "/examples/sandbox_evaluating_javascript/",
    type: "example",
    category: "Deno Sandbox",
  },
  {
    title: "Spawn a subprocess",
    href: "/examples/sandbox_spawn_subprocess/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Serve a web framework",
    href: "/examples/sandbox_web_framework/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Provide SSH access to a sandbox",
    href: "/examples/sandbox_ssh_access/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Interactive JavaScript REPL",
    href: "/examples/sandbox_javascript_repl/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Provide a VSCode instance in a sandbox",
    href: "/examples/sandbox_vscode_instance/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Use template literals with variable interpolation",
    href: "/examples/sandbox_template_literals/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Error handling",
    href: "/examples/sandbox_error_handling/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Command cancellation",
    href: "/examples/sandbox_command_cancellation/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Streaming access string and binary output",
    href: "/examples/sandbox_access_output/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Set and get environment variables",
    href: "/examples/sandbox_environment_variables/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Stream output to a local file",
    href: "/examples/sandbox_stream_output/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Upload files and directories to a sandbox",
    href: "/examples/sandbox_upload_files/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Control sandbox timeout",
    href: "/examples/sandbox_timeout_control/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Configure sandbox memory",
    href: "/examples/sandbox_memory/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Add read-write volumes to your Sandbox",
    href: "/examples/volumes_tutorial/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Boot instantly with snapshots",
    href: "/examples/snapshots_tutorial/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Boot a Python environment with snapshots",
    href: "/examples/snapshot_python_video/",
    type: "video",
    category: "Deno Sandbox",
  },
  {
    title: "Boot a Python environment with snapshots",
    href: "/examples/snapshot_python_tutorial/",
    type: "tutorial",
    category: "Deno Sandbox",
  },
  {
    title: "Run AI generated code",
    href: "/examples/sandbox_for_untrusted_code/",
    type: "example",
    category: "Deno Sandbox",
  },

  {
    title: "Debounce a function",
    href: "/examples/debounce_function/",
    type: "example",
    category: "Standard library",
  },
  {
    title: "Run async tasks with a concurrency limit",
    href: "/examples/concurrency_limit/",
    type: "example",
    category: "Standard library",
  },
  {
    title: "Add a timeout to any promise",
    href: "/examples/promise_timeout/",
    type: "example",
    category: "Standard library",
  },
  {
    title: "Memoize an expensive function",
    href: "/examples/memoize_function/",
    type: "example",
    category: "Standard library",
  },
  {
    title: "Parse and compare semver versions",
    href: "/examples/semver_versions/",
    type: "example",
    category: "Standard library",
  },
  {
    title: "Convert string case",
    href: "/examples/string_case/",
    type: "example",
    category: "Standard library",
  },
  {
    title: "Escape text for regular expressions",
    href: "/examples/regexp_escape/",
    type: "example",
    category: "Standard library",
  },
  {
    title: "Parse and format dates",
    href: "/examples/date_format_parse/",
    type: "example",
    category: "Standard library",
  },
  {
    title: "Structured logging",
    href: "/examples/structured_logging/",
    type: "example",
    category: "Standard library",
  },
  {
    title: "Format bytes and durations for humans",
    href: "/examples/format_bytes_duration/",
    type: "example",
    category: "Standard library",
  },
  {
    title: "Parsing and serializing INI",
    href: "/examples/parsing_serializing_ini/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Parsing JSONC",
    href: "/examples/parsing_jsonc/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Parse large CSV files as streams",
    href: "/examples/csv_streaming/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Stream JSON Lines data",
    href: "/examples/json_lines/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Encode and decode MessagePack",
    href: "/examples/msgpack_encoding/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Encode and decode CBOR",
    href: "/examples/cbor_encoding/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Compress data with node:zlib",
    href: "/examples/zlib_compression/",
    type: "example",
    category: "Encoding",
  },
  {
    title: "Create and extract tar archives",
    href: "/examples/tar_archives/",
    type: "example",
    category: "File system",
  },
];

// Section order on the landing page and in the sidebar.
export const categoryOrder = [
  "Basics",
  "Modules and package management",
  "Network",
  "File system",
  "System",
  "Web standard APIs",
  "Standard library",
  "Encoding",
  "CLI",
  "Cryptography",
  "Testing",
  "Web frameworks and libraries",
  "Databases",
  "Deno KV and scheduling",
  "AI",
  "Deploying Deno projects",
  "OpenTelemetry",
  "Deno Sandbox",
];

// Grouped, alphabetized view consumed by the landing page and sidebars.
export const sidebar = categoryOrder.map((title) => ({
  title,
  items: items
    .filter((item) => item.category === title)
    .toSorted((a, b) =>
      a.title.localeCompare(b.title, "en", { sensitivity: "base" })
    ),
}));

export const featuredItems = [
  {
    title: "HTTP Server: Hello world",
    href: "/examples/http_server/",
    type: "example",
    description: "Spin up a web server with Deno.serve in a few lines.",
  },
  {
    title: "Writing tests",
    href: "/examples/writing_tests/",
    type: "example",
    description: "Use the built-in test runner, no dependencies needed.",
  },
  {
    title: "Build a Next.js app",
    href: "/examples/next_tutorial/",
    type: "tutorial",
    description: "Run a full-stack React framework on Deno.",
  },
  {
    title: "Connecting to databases",
    href: "/examples/connecting_to_databases_tutorial/",
    type: "tutorial",
    description: "Postgres, MySQL, MongoDB, SQLite and more.",
  },
  {
    title: "Deploy with Deno Deploy",
    href: "/examples/deno_deploy_tutorial/",
    type: "tutorial",
    description: "Ship your app to the edge in minutes.",
  },
  {
    title: "Built in TypeScript support",
    href: "/examples/typescript_support/",
    type: "video",
    description: "Run TypeScript directly, with zero configuration.",
  },
];

export const sectionTitle = "Examples";
export const sectionHref = "/examples/";
