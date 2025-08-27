import { existsSync } from "@std/fs";

/**
 * Simple file-based cache for optimization
 */
export class GenerationCache {
  private cacheFile: string;
  private cache: Record<string, { mtime: number; hash: string }> = {};

  constructor(cacheFileName = ".gen-cache.json") {
    this.cacheFile = cacheFileName;
    this.loadCache();
  }

  private loadCache() {
    try {
      if (existsSync(this.cacheFile)) {
        const data = Deno.readTextFileSync(this.cacheFile);
        this.cache = JSON.parse(data);
      }
    } catch {
      this.cache = {};
    }
  }

  private saveCache() {
    try {
      Deno.writeTextFileSync(
        this.cacheFile,
        JSON.stringify(this.cache, null, 2),
      );
    } catch {
      // Ignore cache save errors
    }
  }

  async shouldRegenerate(filePath: string): Promise<boolean> {
    try {
      const stat = await Deno.stat(filePath);
      let mtime: number;

      if (stat.isDirectory) {
        // For directories, get the latest mtime of any file in the directory
        mtime = await this.getDirectoryMtime(filePath);
      } else {
        mtime = stat.mtime?.getTime() || 0;
      }

      const cached = this.cache[filePath];
      if (!cached || cached.mtime < mtime) {
        // Update cache
        this.cache[filePath] = { mtime, hash: String(mtime) };
        this.saveCache();
        return true;
      }

      return false;
    } catch {
      return true; // If we can't check, regenerate
    }
  }

  private async getDirectoryMtime(dirPath: string): Promise<number> {
    let latestMtime = 0;
    try {
      for await (const entry of Deno.readDir(dirPath)) {
        if (entry.isFile) {
          const stat = await Deno.stat(`${dirPath}/${entry.name}`);
          const fileMtime = stat.mtime?.getTime() || 0;
          if (fileMtime > latestMtime) {
            latestMtime = fileMtime;
          }
        }
      }
    } catch {
      return Date.now(); // If we can't read, assume it's changed
    }
    return latestMtime;
  }

  async getFileHash(filePath: string): Promise<string> {
    try {
      const data = await Deno.readTextFile(filePath);
      const hash = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(data),
      );
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch {
      return "";
    }
  }
}
