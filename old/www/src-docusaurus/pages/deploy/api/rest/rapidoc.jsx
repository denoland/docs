import React from "react";
import Layout from "@theme/Layout";

export default function Home() {
  return (
    <Layout
      title={"Deno Deploy API Reference"}
      description="Reference documentation for the Deno Deploy REST API"
    >
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "0",
          right: "0",
          bottom: "0",
        }}
      >
        <rapi-doc spec-url="/openapi.json">
        </rapi-doc>
      </div>
    </Layout>
  );
}
