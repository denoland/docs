#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-net --allow-run

/**
 * Super-optimized parallel documentation generation script
 * with intelligent caching and resource management
 */

import { EnhancedGenerationCache } from "./cache.ts";
import { existsSync } from "@std/fs";

interface TaskConfig {
  name: string;
  command: string[];
  shouldRun: boolean;
  priority: number; // Lower numbers = higher priority
  memoryIntensive: boolean;
}

async function runOptimizedDocGeneration() {
  console.log("🚀 Starting optimized parallel documentation generation...");

  const startTime = performance.now();
  const cache = new EnhancedGenerationCache();

  // Define all possible tasks with priorities and resource requirements
  const allTasks: TaskConfig[] = [
    {
      name: "Deno",
      command: [
        "run",
        "--allow-read",
        "--allow-write",
        "--allow-env",
        "--allow-net",
        "deno-doc.ts",
      ],
      shouldRun: await cache.shouldRegenerate("./types/deno.d.ts") ||
        !existsSync("./gen/deno.json"),
      priority: 1,
      memoryIntensive: false,
    },
    {
      name: "Web",
      command: [
        "run",
        "--allow-read",
        "--allow-write",
        "--allow-env",
        "--allow-net",
        "web-doc.ts",
      ],
      shouldRun: await cache.shouldRegenerate("./types/web.d.ts") ||
        !existsSync("./gen/web.json"),
      priority: 2,
      memoryIntensive: false,
    },
    {
      name: "Node",
      command: [
        "run",
        "--allow-read",
        "--allow-write",
        "--allow-env",
        "--allow-net",
        "node-doc.ts",
      ],
      shouldRun: await cache.shouldRegenerate("./types/node") ||
        !existsSync("./gen/node.json"),
      priority: 3,
      memoryIntensive: true,
    },
  ];

  // Filter tasks that need to run
  const tasksToRun = allTasks.filter((task) => task.shouldRun);

  if (tasksToRun.length === 0) {
    console.log("✨ All documentation is up to date! No regeneration needed.");
    return;
  }

  console.log(
    `📝 Running ${tasksToRun.length} of ${allTasks.length} generation tasks...`,
  );

  // Run all tasks sequentially with aggressive memory management
  console.log(`🔄 Running ${tasksToRun.length} tasks sequentially...`);

  const allResults: Array<{ task: TaskConfig; result: Deno.CommandOutput }> =
    [];

  for (const task of tasksToRun) {
    console.log(`📊 Starting ${task.name} generation...`);

    const memoryLimit = task.memoryIntensive ? "4096" : "2048";

    const result = await new Deno.Command("deno", {
      args: task.command,
      stdout: "piped",
      stderr: "piped",
      env: {
        "DENO_V8_FLAGS": `--max-old-space-size=${memoryLimit}`,
      },
    }).output();

    allResults.push({ task, result });

    if (result.code === 0) {
      console.log(`✅ ${task.name} generation completed`);
    } else {
      console.error(`❌ ${task.name} generation failed`);
    }

    // Longer delay between tasks for memory cleanup
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  const endTime = performance.now();

  // Process all results
  let hasErrors = false;
  for (const { task, result } of allResults) {
    if (result.code !== 0) {
      console.error(`❌ ${task.name} generation failed:`);
      console.error(new TextDecoder().decode(result.stderr));
      hasErrors = true;
    } else {
      const stdout = new TextDecoder().decode(result.stdout);
      if (stdout.trim()) {
        // Show key progress lines for completed tasks
        const lines = stdout.split("\n").filter((line) =>
          line.includes("✅") ||
          line.includes("📝") ||
          line.includes("🎉") ||
          line.includes("completed") ||
          line.includes("Found") ||
          line.includes("Generated")
        );
        if (lines.length > 0) {
          console.log(`  ${lines.slice(-3).join("\n  ")}`); // Show last 3 key lines
        }
      }
    }
  }

  // Show skipped tasks
  for (const task of allTasks) {
    if (!task.shouldRun) {
      console.log(`⏭️  ${task.name} generation skipped (no changes detected)`);
    }
  }

  const totalTime = ((endTime - startTime) / 1000).toFixed(2);
  const tasksRun = allResults.length;
  const tasksSkipped = allTasks.length - tasksRun;

  if (hasErrors) {
    console.log(
      `\n⚠️  Documentation generation completed with errors in ${totalTime}s`,
    );
    console.log(`📊 Tasks: ${tasksRun} run, ${tasksSkipped} skipped`);
    Deno.exit(1);
  } else {
    console.log(
      `\n🎉 Documentation generation completed successfully in <green>${totalTime}s</green>`,
    );
    console.log(`📊 Tasks: ${tasksRun} run, ${tasksSkipped} skipped`);
  }
}

if (import.meta.main) {
  await runOptimizedDocGeneration();
}
