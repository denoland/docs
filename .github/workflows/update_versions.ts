// Copyright 2022-2024 the Deno authors. All rights reserved. MIT license.

import { $ } from "https://raw.githubusercontent.com/denoland/automation/0.19.2/mod.ts";
import {
  createOctoKit,
  getGitHubRepository,
} from "https://raw.githubusercontent.com/denoland/automation/0.19.2/github_actions.ts";

interface ReplacementsData {
  CLI_VERSION: string;
}

const replacementsFile = $.path("replacements.json");
const latestCliVersion = (await getLatestTagForRepo("deno")).replace("v", "");

$.log(`cli version: ${latestCliVersion}`);

const replacements = replacementsFile.readJsonSync<ReplacementsData>();

replacements.CLI_VERSION = latestCliVersion;

replacementsFile.writeJsonPrettySync(replacements);

if (Deno.args.includes("--create-pr")) {
  await tryCreatePr();
}

async function getLatestTagForRepo(name: string) {
  $.logStep(`Fetching latest release for ${name}...`);
  const latestRelease = await $.request(
    `https://api.github.com/repos/denoland/${name}/releases/latest`,
  )
    .header("accept", "application/vnd.github.v3+json")
    .json<{ tag_name: string }>();
  return latestRelease.tag_name;
}

async function tryCreatePr() {
  // check for local changes
  await $`git add .`;
  const hasLocalChanges = (await $`git status --porcelain`.text()).length > 0;
  if (!hasLocalChanges) {
    $.log("Had no local changes.");
    return;
  }

  // commit and push
  const branchName = `bump_version${latestCliVersion}`;
  const commitMessage = `Updated files for ${latestCliVersion}`;
  await $`git checkout -b ${branchName}`;
  await $`git commit -m ${commitMessage}`;
  await $`git remote add denobot https://github.com/denobot/deno-docs`;
  $.logStep("Pushing branch...");
  // note: if this push fails because of not having a "workflow" PAT permission,
  // just ensure that denobot's main branch is synced with this repo
  await $`git push -u denobot HEAD`;

  // open a PR
  $.logStep("Opening PR...");
  const octoKit = createOctoKit();
  const openedPr = await octoKit.request("POST /repos/{owner}/{repo}/pulls", {
    ...getGitHubRepository(),
    base: "main",
    head: `denobot:${branchName}`,
    draft: false,
    title: `chore: update for ${latestCliVersion}`,
    body: getPrBody(),
  });
  $.log(`Opened PR at ${openedPr.data.url}`);

  function getPrBody() {
    let text = `Bumped versions for ${latestCliVersion}\n\n` +
      `To make edits to this PR:\n` +
      "```shell\n" +
      `gh pr checkout <THIS PR NUMBER>\n` +
      "```\n";

    const actor = Deno.env.get("GH_WORKFLOW_ACTOR");
    if (actor != null) {
      text += `\ncc @${actor}`;
    }

    return text;
  }
}
