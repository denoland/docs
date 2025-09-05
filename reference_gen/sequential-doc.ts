#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-net --allow-run

/**
 * Sequential documentation generation script
 * Processes all documentation types one after another with minimal memory usage
 */

import { EnhancedGenerationCache } from "./cache.ts";
import { existsSync } from "@std/fs";

async function runSequentialDocGeneration() {
  console.log("🚀 Starting sequential documentation generation...");

  const startTime = performance.now();
  const cache = new EnhancedGenerationCache();

  // Check what needs to be generated
  const tasks = [
    {
      name: "Deno",
      script: "deno-doc.ts",
      shouldRun: await cache.shouldRegenerate("./types/deno.d.ts") ||
        !existsSync("./gen/deno.json"),
    },
    {
      name: "Web",
      script: "web-doc.ts",
      shouldRun: await cache.shouldRegenerate("./types/web.d.ts") ||
        !existsSync("./gen/web.json"),
    },
    {
      name: "Node",
      script: "node-doc.ts",
      shouldRun: await cache.shouldRegenerate("./types/node") ||
        !existsSync("./gen/node.json"),
    },
  ];

  const tasksToRun = tasks.filter((task) => task.shouldRun);

  if (tasksToRun.length === 0) {
    console.log("✨ All documentation is up to date!");
    return;
  }

  console.log(`📝 Running ${tasksToRun.length} tasks sequentially...`);

  // Run each script as a subprocess
  for (const task of tasksToRun) {
    console.log(`📊 Starting ${task.name} generation...`);

    try {
      const command = new Deno.Command("deno", {
        args: [
          "run",
          "--allow-read",
          "--allow-write",
          "--allow-env",
          "--allow-net",
          task.script,
        ],
        stdout: "inherit",
        stderr: "inherit",
      });

      const { code } = await command.output();

      if (code === 0) {
        console.log(`✅ ${task.name} generation completed`);
      } else {
        console.error(
          `❌ ${task.name} generation failed with exit code ${code}`,
        );
        Deno.exit(1);
      }
    } catch (error) {
      console.error(`❌ ${task.name} generation failed:`, error);
      Deno.exit(1);
    }

    // Small delay between tasks
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Show skipped tasks
  for (const task of tasks) {
    if (!task.shouldRun) {
      console.log(`⏭️  ${task.name} generation skipped (no changes detected)`);
    }
  }

  const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
  const tasksRun = tasksToRun.length;
  const tasksSkipped = tasks.length - tasksRun;

  console.log(
    `\n🎉 Documentation generation completed successfully in ${totalTime}s`,
  );
  console.log(`📊 Tasks: ${tasksRun} run, ${tasksSkipped} skipped`);
}

if (import.meta.main) {
  await runSequentialDocGeneration();
}
