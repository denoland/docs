#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-net --allow-run

/**
 * Optimized parallel documentation generation script
 */

import { GenerationCache } from "./cache.ts";

async function runDocGeneration() {
  console.log("Starting parallel documentation generation...");

  const startTime = performance.now();
  const cache = new GenerationCache();

  // Check if files need regeneration
  const tasks: Array<{ name: string; command: string[]; shouldRun: boolean }> =
    [];

  // Check Deno types
  const denoShouldRegen = await cache.shouldRegenerate("./types/deno.d.ts");
  tasks.push({
    name: "Deno",
    command: [
      "run",
      "--allow-read",
      "--allow-write",
      "--allow-env",
      "--allow-net",
      "deno-doc.ts",
    ],
    shouldRun: denoShouldRegen,
  });

  // Check Web types
  const webShouldRegen = await cache.shouldRegenerate("./types/web.d.ts");
  tasks.push({
    name: "Web",
    command: [
      "run",
      "--allow-read",
      "--allow-write",
      "--allow-env",
      "--allow-net",
      "web-doc.ts",
    ],
    shouldRun: webShouldRegen,
  });

  // For Node, check if directory changed
  const nodeShouldRegen = await cache.shouldRegenerate("./types/node");

  tasks.push({
    name: "Node",
    command: [
      "run",
      "--allow-read",
      "--allow-write",
      "--allow-env",
      "--allow-net",
      "node-doc.ts",
    ],
    shouldRun: nodeShouldRegen,
  });

  // Filter tasks that need to run
  const tasksToRun = tasks.filter((task) => task.shouldRun);

  if (tasksToRun.length === 0) {
    console.log("✨ All documentation is up to date! No regeneration needed.");
    return;
  }

  console.log(
    `📝 Running ${tasksToRun.length} of ${tasks.length} generation tasks...`,
  );

  // Run tasks in parallel with better resource management
  const promises = tasksToRun.map(async (task, index) => {
    // Stagger start times slightly to reduce initial resource spike
    if (index > 0) {
      await new Promise((resolve) => setTimeout(resolve, index * 500));
    }

    return new Deno.Command("deno", {
      args: task.command,
      stdout: "piped",
      stderr: "piped",
    }).output().then((result) => ({ task, result }));
  });

  const results = await Promise.all(promises);
  const endTime = performance.now();

  // Check for errors and print outputs
  let hasErrors = false;
  for (const { task, result } of results) {
    if (result.code !== 0) {
      console.error(`❌ ${task.name} generation failed:`);
      console.error(new TextDecoder().decode(result.stderr));
      hasErrors = true;
    } else {
      console.log(`✅ ${task.name} generation completed`);
      const stdout = new TextDecoder().decode(result.stdout);
      if (stdout.trim()) {
        // Only show key progress lines, not all output
        const lines = stdout.split("\n").filter((line) =>
          line.includes("Generating") ||
          line.includes("completed") ||
          line.includes("Found") ||
          line.includes("Generated")
        );
        if (lines.length > 0) {
          console.log(`  ${lines.join("\n  ")}`);
        }
      }
    }
  }

  // Log skipped tasks
  for (const task of tasks) {
    if (!task.shouldRun) {
      console.log(`⏭️  ${task.name} generation skipped (no changes)`);
    }
  }

  const totalTime = ((endTime - startTime) / 1000).toFixed(2);
  if (hasErrors) {
    console.log(
      `\n⚠️  Documentation generation completed with errors in ${totalTime}s`,
    );
    Deno.exit(1);
  } else {
    console.log(
      `\n🎉 Documentation generation completed successfully in ${totalTime}s`,
    );
  }
}

if (import.meta.main) {
  await runDocGeneration();
}
