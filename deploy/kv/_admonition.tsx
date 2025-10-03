export function Admonition({ type, children }) {
  return <div>TODO</div>;
}

// :::caution Deno KV is currently in beta

// Deno KV and related cloud primitive APIs like queues and cron are currently
// **experimental** and **subject to change**. While we do our best to ensure data
// durability, data loss is possible, especially around Deno updates.

// Deno programs that use KV require the `--unstable` flag when launching the
// program, as shown below:

// ```sh
// deno run -A --unstable my_kv_code.ts
// ```

// :::
