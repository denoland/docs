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

  // Sort by priority and memory requirements
  tasksToRun.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // Run memory-intensive tasks last
    return a.memoryIntensive ? 1 : -1;
  });

  // Run high-priority, low-memory tasks in parallel
  const lightTasks = tasksToRun.filter((task) => !task.memoryIntensive);
  const heavyTasks = tasksToRun.filter((task) => task.memoryIntensive);

  const allResults: Array<{ task: TaskConfig; result: Deno.CommandOutput }> =
    [];

  // Process light tasks in parallel
  if (lightTasks.length > 0) {
    console.log(
      `⚡ Running ${lightTasks.length} lightweight tasks in parallel...`,
    );

    const lightPromises = lightTasks.map(async (task, index) => {
      // Slight stagger to reduce initial resource spike
      if (index > 0) {
        await new Promise((resolve) => setTimeout(resolve, index * 200));
      }

      return new Deno.Command("deno", {
        args: task.command,
        stdout: "piped",
        stderr: "piped",
        env: { "DENO_V8_FLAGS": "--max-old-space-size=4096" }, // Increase memory limit
      }).output().then((result) => ({ task, result }));
    });

    const lightResults = await Promise.all(lightPromises);
    allResults.push(...lightResults);

    // Small delay to let memory settle
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Process heavy tasks sequentially with memory management
  if (heavyTasks.length > 0) {
    console.log(
      `🏋️ Running ${heavyTasks.length} memory-intensive tasks sequentially...`,
    );

    for (const task of heavyTasks) {
      console.log(`📊 Starting ${task.name} generation...`);

      const result = await new Deno.Command("deno", {
        args: task.command,
        stdout: "piped",
        stderr: "piped",
        env: {
          "DENO_V8_FLAGS": "--max-old-space-size=8192",
        },
      }).output();

      allResults.push({ task, result });

      if (result.code === 0) {
        console.log(`✅ ${task.name} generation completed`);
      }

      // Force garbage collection and memory cleanup
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
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
      `\n🎉 Documentation generation completed successfully in <green>${totalTime}s<green`,
    );
    console.log(`📊 Tasks: ${tasksRun} run, ${tasksSkipped} skipped`);
  }
}

if (import.meta.main) {
  await runOptimizedDocGeneration();
}
