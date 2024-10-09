/**
 * @title Permission management
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.Permissions} Doc: Deno.Permissions
 * @group CLI
 *
 * There are times where depending on the state of permissions
 * granted to a process, we want to do different things. This is
 * made very easy to do with the Deno permissions API.
 */

// In the most simple case, we can just request a permission by it's name.
// In this case, we ask for --allow-env and prompt the user. The user will
// not be prompted if it was already allowed in the past and not revoked.
let status = await Deno.permissions.request({ name: "env" });
if (status.state === "granted") {
  console.log("'env' permission is granted.");
} else {
  console.log("'env' permission is denied.");
}

// There are also synchronous versions of all the permission APIs
status = Deno.permissions.requestSync({ name: "env" });
if (status.state === "granted") {
  console.log("'env' permission is granted.");
} else {
  console.log("'env' permission is denied.");
}

// We can also query permissions without asking for them. In this case,
// we are querying whether or not we have the read permission. Not only
// can we query whether we have a permission or not, we can even specify
// what directories we have permissions in using the path option.
const readStatus = await Deno.permissions.query({
  name: "read",
  path: "/etc",
});
console.log(readStatus.state);

// In the case that we no longer need a permission, it is also possible
// to revoke a process's access to that permission. This is useful when
// a process starts running untrusted code.
import { assert } from "jsr:@std/assert";

const runStatus = await Deno.permissions.revoke({ name: "run" });
assert(runStatus.state !== "granted");
