// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { $ } from "https://raw.githubusercontent.com/denoland/automation/0.19.2/mod.ts";
import {
  createOctoKit,
  getGitHubRepository,
} from "https://raw.githubusercontent.com/denoland/automation/0.19.2/github_actions.ts";

interface ReplacementsData {
  CLI_VERSION: string;
  STD_VERSION: string;
}

const replacementsFile = $.path("replacements.json");
const latestCliTag = await getLatestTagForRepo("deno");
const latestStdTag = await getLatestTagForRepo("deno_std");

$.log(`cli tag: ${latestCliTag}`);
$.log(`std tag: ${latestStdTag}`);

const replacements = replacementsFile.readJsonSync<ReplacementsData>();

replacements.CLI_VERSION = latestCliTag;
replacements.STD_VERSION = latestStdTag;

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
  const branchName = `bump_version${latestCliTag}`;
  const commitMessage = `Updated files for ${latestCliTag}`;
  await $`git checkout -b ${branchName}`;
  await $`git commit -m ${commitMessage}`;
  $.logStep("Pushing branch...");
  await $`git push -u origin HEAD`;

  // open a PR
  $.logStep("Opening PR...");
  const octoKit = createOctoKit();
  const openedPr = await octoKit.request("POST /repos/{owner}/{repo}/pulls", {
    ...getGitHubRepository(),
    base: "main",
    head: branchName,
    draft: false,
    title: `chore: update for ${latestCliTag}`,
    body: getPrBody(),
  });
  $.log(`Opened PR at ${openedPr.data.url}`);

  function getPrBody() {
    let text = `Bumped versions for ${latestCliTag}\n\n` +
      `To make edits to this PR:\n` +
      "```shell\n" +
      `git fetch upstream ${branchName} && git checkout -b ${branchName} upstream/${branchName}\n` +
      "```\n";

    const actor = Deno.env.get("GH_WORKFLOW_ACTOR");
    if (actor != null) {
      text += `\ncc @${actor}`;
    }

    return text;
  }
}
