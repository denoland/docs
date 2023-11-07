import React, { useEffect, useState } from "react";
import OpenAPIParser from "@readme/openapi-parser";
import Details from "@theme/Details";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import mdit from "markdown-it";

const mdengine = mdit({
  html: true,
});

function md(str) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: mdengine.render(str || "").trim(),
      }}
    >
    </div>
  );
}

// static variable for OpenAPI definition - should only need to load once
let API = null;

// render information about method and path
function MethodPath({ method, path }) {
  const methodStyles = {
    display: "inline-block",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1em",
    padding: "0 6px",
    backgroundColor: "#4DACDB",
    margin: "0 10px 10px 0",
    borderRadius: "4px",
  };

  switch (method) {
    case "put":
    case "patch":
    case "post":
      methodStyles.backgroundColor = "#82CC4D";
      break;
    case "delete":
      methodStyles.backgroundColor = "#FA402C";
      break;
  }

  return (
    <div>
      <span style={methodStyles}>
        {method.toUpperCase()}
      </span>
      <code
        style={{
          display: "inline-block",
          padding: "0 6px",
          fontSize: "1em",
        }}
      >
        {"/v1" + path}
      </code>
    </div>
  );
}

// Render details block for parameters
function Parameters({ apiDef, customDocs }) {
  const parameterRows = [];
  apiDef.parameters.forEach((param) => {
    const description = customDocs[param.name]
      ? customDocs[param.name]
      : param.description || "";
    parameterRows.push(
      <tr key={param.name}>
        <td>
          <code style={{ whiteSpace: "nowrap" }}>
            {param.name}
            {param.required ? " (required)" : ""}
          </code>
        </td>
        <td>
          <code style={{ whiteSpace: "nowrap" }}>
            {`${param.schema.type}${
              param.schema.format ? ` (${param.schema.format})` : ""
            }`}
          </code>
        </td>
        <td>
          {md(description)}
        </td>
      </tr>,
    );
  });

  return (
    <Details summary="Parameters">
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
          {parameterRows}
        </tbody>
      </table>
    </Details>
  );
}

// Render details block for request body
function RequestBody({ apiDef, customDocs }) {
  const schema = apiDef.requestBody.content["application/json"].schema;
  const bodyProperties = [];

  Object.keys(schema.properties).forEach((propName) => {
    const prop = schema.properties[propName];
    const description = customDocs[propName]
      ? customDocs[propName]
      : prop.description || "";
    bodyProperties.push(
      <tr key={propName}>
        <td>
          <code style={{ whiteSpace: "nowrap" }}>
            {propName}
            {prop.nullable ? " (nullable)" : ""}
          </code>
        </td>
        <td>
          {prop.type
            ? (
              <code style={{ whiteSpace: "nowrap" }}>
                {`${prop.type} ${prop.format ? `(${prop.format})` : ""}`}
              </code>
            )
            : <code>object</code>}
        </td>
        <td>
          {md(description)}
        </td>
      </tr>,
    );
  });

  return (
    <>
      <Details summary="Request Body (JSON)">
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
            {bodyProperties}
          </tbody>
        </table>
        {schema.example
          ? (
            <>
              <h5>Example Body</h5>
              <pre
                style={{
                  maxHeight: "300px",
                }}
              ><code>{JSON.stringify(schema.example, null, 2)}</code></pre>
            </>
          )
          : ""}
      </Details>
    </>
  );
}

// Render details block for response bodies
function Responses({ apiDef, customDocs }) {
  // Create tabs for possible responses
  const tabs = [];

  Object.keys(apiDef.responses).forEach((responseCode) => {
    const resp = apiDef.responses[responseCode];
    let jsonExample = null;
    const responseProps = [];

    if (resp.content && resp.content["application/json"]) {
      let responseSchema = resp.content["application/json"].schema;
      let { properties, example } = responseSchema;

      if (!properties && responseSchema.allOf) {
        responseSchema.allOf.forEach((s) => {
          if (s.properties) {
            properties = s.properties;
          }
        });
      } else if (responseSchema.type === "array") {
        if (responseSchema.items.allOf) {
          responseSchema.items.allOf.forEach((s) => {
            if (s.properties) {
              properties = s.properties;
            }
          });
        } else {
          properties = responseSchema.items.properties;
        }
      }

      jsonExample =
        (example && responseSchema.type && responseSchema.type === "array")
          ? [example]
          : example;

      Object.keys(properties).forEach((propName) => {
        const prop = properties[propName];
        const description = customDocs[propName]
          ? customDocs[propName]
          : prop.description || "";
        responseProps.push(
          <tr key={propName}>
            <td>
              <code style={{ whiteSpace: "nowrap" }}>{propName}</code>
            </td>
            <td>
              <code style={{ whiteSpace: "nowrap" }}>
                {`${prop.type} ${prop.format ? `(${prop.format})` : ""}`}
              </code>
            </td>
            <td>
              {md(description)}
            </td>
          </tr>,
        );
      });
    }

    tabs.push(
      <TabItem
        key={responseCode}
        value={responseCode}
        label={responseCode}
        attributes={{
          style: {
            fontSize: "14px",
          },
        }}
      >
        <h5>Response Type</h5>
        <p>{resp.description}</p>

        {responseProps.length > 0
          ? (
            <>
              <h5>Content Type</h5>
              <p>
                <code>application/json</code>
              </p>

              <h5>Response Properties</h5>
              <table>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                  {responseProps}
                </tbody>
              </table>
            </>
          )
          : "Empty response body"}

        {jsonExample
          ? (
            <>
              <h5>Example</h5>
              <pre
                style={{
                  maxHeight: "300px",
                }}
              ><code>{JSON.stringify(jsonExample, null, 2)}</code></pre>
            </>
          )
          : ""}
      </TabItem>,
    );
  });

  return (
    <Details summary="Responses">
      <Tabs>
        {tabs}
      </Tabs>
    </Details>
  );
}

// Render generated information for an OpenAPI path
function Endpoint({ method, path, apiDef, customDocs, children }) {
  return (
    <>
      <MethodPath method={method} path={path} />
      <div style={{ margin: "10px 0" }}>
        {children || md(apiDef.description)}
      </div>
      {apiDef.parameters && apiDef.parameters.length > 0
        ? <Parameters apiDef={apiDef} customDocs={customDocs} />
        : ""}
      {apiDef.requestBody
        ? <RequestBody apiDef={apiDef} customDocs={customDocs} />
        : ""}
      {apiDef.responses
        ? <Responses apiDef={apiDef} customDocs={customDocs} />
        : ""}
    </>
  );
}

export default function OpenApiEndpoint(
  { path, method, customDocs, children },
) {
  const [apiDef, setApiDef] = useState(API);

  // Execute once - will load API definition if needed
  useEffect(async () => {
    if (apiDef) return;

    try {
      API = await OpenAPIParser.validate("/openapi.json");
      console.log("Loaded: %s, Version: %s", API.info.title, API.info.version);
      setApiDef(API);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // If first load, will be null
  if (!apiDef) return <></>;

  // Get subset of definition for requested path/method
  const requestedPath = apiDef.paths[path][method];

  // Once API definition is loaded, can render component
  return (
    <Endpoint
      path={path}
      method={method}
      apiDef={requestedPath}
      customDocs={customDocs || {}}
    >
      {children || ""}
    </Endpoint>
  );
}
