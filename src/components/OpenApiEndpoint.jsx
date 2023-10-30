import React from "react";
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

export const apiDefinition = require("../../openapi.json");

export default function OpenApiEndpoint({ children, path, method }) {
  const def = apiDefinition.paths[path][method];

  // Create rows of parameter table
  const parameterRows = [];
  def.parameters.forEach((param) => {
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
          {md(param.description)}
        </td>
      </tr>,
    );
  });

  // Create tabs for possible responses
  const tabs = [];
  Object.keys(def.responses).forEach((responseCode) => {
    const resp = def.responses[responseCode];

    // TODO - document headers in responses as well

    let jsonExample = null;
    const responseProps = [];

    if (resp.content) {
      let schemaObject;
      const responseSchema = resp.content["application/json"].schema;
      if (responseSchema.type === "array") {
        schemaObject = responseSchema.items["$ref"].split("/").pop();
      } else {
        schemaObject = responseSchema["$ref"].split("/").pop();
      }
      const { properties, example } =
        apiDefinition.components.schemas[schemaObject];

      jsonExample =
        (example && responseSchema.type && responseSchema.type === "array")
          ? [example]
          : example;

      Object.keys(properties).forEach((propName) => {
        responseProps.push(
          <tr key={propName}>
            <td>
              <code style={{ whiteSpace: "nowrap" }}>{propName}</code>
            </td>
            <td>
              <code style={{ whiteSpace: "nowrap" }}>
                {`${properties[propName].type} ${
                  properties[propName].format
                    ? `(${properties[propName].format})`
                    : ""
                }`}
              </code>
            </td>
            <td>
              {md(properties[propName].description)}
            </td>
          </tr>,
        );
      });
    }

    tabs.push(
      <TabItem
        key={responseCode}
        value={responseCode}
        label={`${resp.description} (${responseCode})`}
        attributes={{
          style: {
            fontSize: "14px",
          },
        }}
      >
        {responseProps.length > 0
          ? (
            <>
              <h5>Response Type</h5>
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

  // Determine style for HTTP method
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

  // Determine if a request body needs to be inserted, and get data
  let bodySchema = null;
  const bodyProperties = [];
  if (def.requestBody) {
    const responseSchema = def.requestBody.content["application/json"]
      .schema["$ref"].split("/").pop();

    bodySchema = apiDefinition.components.schemas[responseSchema];

    Object.keys(bodySchema.properties).forEach((propName) => {
      const prop = bodySchema.properties[propName];

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
            {md(prop.description)}
          </td>
        </tr>,
      );
    });
  }

  return (
    <>
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

      <div
        style={{
          margin: "10px 0",
        }}
      >
        {children || md(def.description)}
      </div>

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

      {bodySchema
        ? (
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
            {bodySchema.example
              ? (
                <>
                  <h5>Example Body</h5>
                  <pre
                    style={{
                      maxHeight: "300px",
                    }}
                  ><code>{JSON.stringify(bodySchema.example, null, 2)}</code></pre>
                </>
              )
              : ""}
          </Details>
        )
        : ""}

      <Details summary="Responses">
        <Tabs>
          {tabs}
        </Tabs>
      </Details>
    </>
  );
}
