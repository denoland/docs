/**
 * @title Connect to Supabase
 * @difficulty intermediate
 * @tags cli, deploy
 * @run --allow-net --allow-env <url>
 * @resource {https://supabase.com/docs/reference/javascript/installing} supabase-js docs
 * @resource {https://jsr.io/@supabase/supabase-js} supabase-js on jsr.io
 * @group Databases
 *
 * You can connect to a Supabase database using the `supabase-js` library.
 */

// Import the createClient function from jsr supabase-js package
import { createClient } from "jsr:@supabase/supabase-js@2";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_KEY")!
);

// Insert data into the countries table
export async function insertCountryData(
  code: string = "JP",
  name: string = "Japan"
) {
  const { data, error } = await supabase
    .from("countries")
    .insert({ code, name })
    .select();

  if (error) {
    console.error(error);
  }

  return data; // [ { code: "JP", name: "Japan" } ]
}

// Get data from the countries table
export async function getData() {
  const { data, error } = await supabase
    .from("countries")
    .select();

  if (error) {
    console.error(error);
  }

  return data; // [ { code: "JP", name: "Japan" }, ... ]
}
