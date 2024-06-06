import React from "react";
import APIReferenceIndex from "/../src/components/APIReferenceIndex";

const links = [
  {
    id: "1",
    title: "FFI",
    description:
      "Foreign Function Interface. Call functions from shared libraries (e.g., C/C++) directly from Deno. Useful for integrating with existing native code or accessing low-level system functionality.",
    url: "/api/deno/ffi",
  },
  {
    id: "2",
    title: "I/O",
    description:
      "Interfaces for reading, writing, seeking, and managing resources. For handling of data streams, file I/O, and console interactions.",
    url: "/api/deno/io",
  },
  {
    id: "3",
    title: "Permissions",
    description:
      "Permission system controls access to resources (e.g., file system, network, environment variables). Request permissions explicitly, enhancing security and user trust.",
    url: "/api/deno/permissions",
  },
  {
    id: "4",
    title: "Jupyter",
    description:
      "Create interactive notebooks and execute code cells. Useful for data analysis, visualization, and educational purposes.",
    url: "/api/deno/jupyter",
  },
  {
    id: "5",
    title: "Cloud",
    description:
      "Tools for managing state, scheduling tasks, and interacting with key-value stores.",
    url: "/api/deno/cloud",
  },
  {
    id: "6",
    title: "FS",
    description:
      "File System APIs for working with files, directories, and file metadata. Includes functions for reading, writing, and manipulating file paths.",
    url: "/api/deno/fs",
  },
  {
    id: "7",
    title: "Network",
    description:
      "A wide range of networking tasks, from low-level connections to high-level server creation. Handle HTTP requests, WebSocket communication, and DNS resolution. Useful for building web servers, clients, and networking tools.",
    url: "/api/deno/network",
  },
  {
    id: "8",
    title: "HTTP Server",
    description:
      "Handling HTTP requests, serving responses, and managing server behavior.",
    url: "/api/deno/http-server",
  },
  {
    id: "9",
    title: "Sub Process",
    description:
      "Spawn and manage child processes, execute commands, and collect output. Useful for executing external programs from Deno.",
    url: "/api/deno/sub-process",
  },
  {
    id: "10",
    title: "Errors",
    description:
      "Error types and utilities for handling exceptions and custom error scenarios. Helps improve error handling and debugging.",
    url: "/api/deno/errors",
  },
  {
    id: "11",
    title: "Runtime Env",
    description:
      "System-related functionality, process management, and observability.",
    url: "/api/deno/runtime-env",
  },
  {
    id: "12",
    title: "Testing & Benchmarking",
    description:
      "Robust testing and benchmarking capabilities to ensure code quality and performance.",
    url: "/api/deno/testing-benchmarking",
  },
];

const APIPage = () => {
  return <APIReferenceIndex apiLinks={links} />;
};

export default APIPage;
