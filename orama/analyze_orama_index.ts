#!/usr/bin/env -S deno run --allow-read
/**
 * Orama Index Analyzer
 *
 * This script analyzes the generated Orama index to help you understand
 * what content will be searchable and identify any potential issues.
 */

import { fromFileUrl, join } from "@std/path";

const ROOT_DIR = fromFileUrl(new URL("../", import.meta.url));

interface Document {
  id: string;
  title: string;
  content: string;
  url: string;
  category: string;
  section: string;
  description?: string;
  tags: string[];
  headings: string[];
}

interface IndexData {
  metadata: {
    generatedAt: string;
    totalDocuments: number;
    stats: {
      totalCharacters: number;
      averageDocumentLength: number;
      [key: string]: unknown;
    };
  };
  documents: Document[];
}

async function analyzeIndex(filePath: string = "static/orama-index.json") {
  console.log("🔍 Analyzing Orama Index\n");

  try {
    const content = await Deno.readTextFile(join(ROOT_DIR, filePath));
    const data: IndexData = JSON.parse(content);

    console.log("General Statistics:");
    console.log(`   Documents: ${data.documents.length}`);
    console.log(
      `   Generated: ${new Date(data.metadata.generatedAt).toLocaleString()}`,
    );
    console.log(
      `   Total characters: ${data.metadata.stats.totalCharacters.toLocaleString()}`,
    );
    console.log(
      `   Average length: ${data.metadata.stats.averageDocumentLength} chars\n`,
    );

    // Analyze by category
    const categories = new Map<string, number>();
    data.documents.forEach((doc) => {
      const cat = doc.category.split("\\")[0]; // Get top-level category
      categories.set(cat, (categories.get(cat) || 0) + 1);
    });

    console.log("📁 Documents by Category:");
    for (
      const [category, count] of [...categories.entries()].sort((a, b) =>
        b[1] - a[1]
      )
    ) {
      console.log(`   ${category}: ${count} documents`);
    }
    console.log("");

    // Find longest and shortest documents
    const sortedByLength = [...data.documents].sort((a, b) =>
      b.content.length - a.content.length
    );

    console.log("Content Length Analysis:");
    console.log(
      `   Longest: "${sortedByLength[0].title}" (${
        sortedByLength[0].content.length
      } chars)`,
    );
    console.log(
      `   Shortest: "${sortedByLength[sortedByLength.length - 1].title}" (${
        sortedByLength[sortedByLength.length - 1].content.length
      } chars)\n`,
    );

    // Analyze tags
    const allTags = new Set<string>();
    data.documents.forEach((doc) =>
      doc.tags.forEach((tag) => allTags.add(tag))
    );

    console.log("Tags Found:");
    if (allTags.size > 0) {
      console.log(`   Total unique tags: ${allTags.size}`);
      const tagCounts = new Map<string, number>();
      data.documents.forEach((doc) => {
        doc.tags.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });

      const sortedTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      console.log("   Most common tags:");
      sortedTags.forEach(([tag, count]) => {
        console.log(`     ${tag}: ${count} documents`);
      });
    } else {
      console.log("   No tags found");
    }
    console.log("");

    // Analyze descriptions
    const withDescriptions = data.documents.filter((doc) => doc.description);
    console.log("Descriptions:");
    console.log(
      `   Documents with descriptions: ${withDescriptions.length}/${data.documents.length} (${
        Math.round(withDescriptions.length / data.documents.length * 100)
      }%)\n`,
    );

    // Sample documents for quality check
    console.log("📋 Sample Documents:");
    const samples = [
      data.documents.find((doc) =>
        doc.title.toLowerCase().includes("installation")
      ),
      data.documents.find((doc) =>
        doc.title.toLowerCase().includes("getting started")
      ),
      data.documents.find((doc) => doc.content.length > 5000),
    ].filter(Boolean);

    samples.forEach((doc, i) => {
      if (doc) {
        console.log(`   ${i + 1}. "${doc.title}"`);
        console.log(`      URL: ${doc.url}`);
        console.log(`      Category: ${doc.category}`);
        console.log(
          `      Content: ${
            doc.content.substring(0, 100).replace(/\n/g, " ")
          }...`,
        );
        console.log(`      Length: ${doc.content.length} chars`);
        if (doc.tags.length > 0) {
          console.log(`      Tags: ${doc.tags.join(", ")}`);
        }
        console.log("");
      }
    });

    // Check for potential issues
    console.log("⚠️ Potential Issues:");
    const veryShort = data.documents.filter((doc) => doc.content.length < 100);
    const veryLong = data.documents.filter((doc) => doc.content.length > 10000);
    const noTitle = data.documents.filter((doc) =>
      !doc.title || doc.title.length < 3
    );
    const duplicateUrls = findDuplicates(data.documents.map((doc) => doc.url));

    if (veryShort.length > 0) {
      console.log(
        `   ${veryShort.length} documents are very short (< 100 chars)`,
      );
    }
    if (veryLong.length > 0) {
      console.log(
        `   ${veryLong.length} documents are very long (> 10k chars)`,
      );
    }
    if (noTitle.length > 0) {
      console.log(`   ${noTitle.length} documents have poor titles`);
    }
    if (duplicateUrls.length > 0) {
      console.log(`   ${duplicateUrls.length} duplicate URLs found`);
    }
    if (
      veryShort.length === 0 && veryLong.length === 0 && noTitle.length === 0 &&
      duplicateUrls.length === 0
    ) {
      console.log("   No issues detected! ✅");
    }

    console.log("\n✅ Analysis complete!");
  } catch (error) {
    console.error("❌ Error analyzing index:", error);
    console.log("\nMake sure you've run 'deno task generate:orama' first");
  }
}

function findDuplicates(arr: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  arr.forEach((item) => {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  });

  return Array.from(duplicates);
}

if (import.meta.main) {
  const filePath = Deno.args[0];
  await analyzeIndex(filePath);
}
