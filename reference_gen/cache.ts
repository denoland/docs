import { existsSync } from "@std/fs";

/**
 * Enhanced caching system with content-based hashing and incremental generation
 */
export class EnhancedGenerationCache {
  private cacheFile: string;
  private cache: Record<
    string,
    { mtime: number; hash: string; size?: number }
  > = {};
  private moduleCache: Record<string, { hash: string; lastGenerated: number }> =
    {};
  private moduleCacheFile: string;

  constructor(cacheFileName = ".gen-cache.json") {
    this.cacheFile = cacheFileName;
    this.moduleCacheFile = cacheFileName.replace(".json", "-modules.json");
    this.loadCache();
    this.loadModuleCache();
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

  private loadModuleCache() {
    try {
      if (existsSync(this.moduleCacheFile)) {
        const data = Deno.readTextFileSync(this.moduleCacheFile);
        this.moduleCache = JSON.parse(data);
      }
    } catch {
      this.moduleCache = {};
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

  private saveModuleCache() {
    try {
      Deno.writeTextFileSync(
        this.moduleCacheFile,
        JSON.stringify(this.moduleCache, null, 2),
      );
    } catch {
      // Ignore cache save errors
    }
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

  async shouldRegenerateModule(modulePath: string): Promise<boolean> {
    try {
      const currentHash = await this.getFileHash(modulePath);
      const cached = this.moduleCache[modulePath];

      if (!cached || cached.hash !== currentHash) {
        this.moduleCache[modulePath] = {
          hash: currentHash,
          lastGenerated: Date.now(),
        };
        this.saveModuleCache();
        return true;
      }

      return false;
    } catch {
      return true; // If we can't check, regenerate
    }
  }

  async shouldRegenerate(filePath: string): Promise<boolean> {
    try {
      const stat = await Deno.stat(filePath);
      let mtime: number;
      let size: number = 0;

      if (stat.isDirectory) {
        mtime = await this.getDirectoryMtime(filePath);
      } else {
        mtime = stat.mtime?.getTime() || 0;
        size = stat.size;
      }

      const cached = this.cache[filePath];

      // Check if file timestamp or size changed
      if (
        !cached || cached.mtime < mtime || (cached.size && cached.size !== size)
      ) {
        // For large directories, also check content hash
        if (stat.isDirectory && size === 0) {
          const contentHash = await this.getDirectoryContentHash(filePath);
          if (cached && cached.hash === contentHash) {
            return false; // Content hasn't actually changed
          }
          this.cache[filePath] = { mtime, hash: contentHash, size };
        } else {
          this.cache[filePath] = { mtime, hash: String(mtime), size };
        }

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
        if (entry.isFile && entry.name.endsWith(".d.ts")) {
          const stat = await Deno.stat(`${dirPath}/${entry.name}`);
          const fileMtime = stat.mtime?.getTime() || 0;
          if (fileMtime > latestMtime) {
            latestMtime = fileMtime;
          }
        }
      }
    } catch {
      return Date.now();
    }
    return latestMtime;
  }

  private async getDirectoryContentHash(dirPath: string): Promise<string> {
    const hashes: string[] = [];
    try {
      for await (const entry of Deno.readDir(dirPath)) {
        if (entry.isFile && entry.name.endsWith(".d.ts")) {
          const fileHash = await this.getFileHash(`${dirPath}/${entry.name}`);
          hashes.push(`${entry.name}:${fileHash}`);
        }
      }
      hashes.sort(); // Ensure consistent ordering

      const combinedHash = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(hashes.join("|")),
      );

      return Array.from(new Uint8Array(combinedHash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch {
      return "";
    }
  }

  getModulesNeedingRegeneration(modules: string[]): Promise<string[]> {
    return Promise.all(
      modules.map(async (module) => {
        const needsRegen = await this.shouldRegenerateModule(module);
        return needsRegen ? module : null;
      }),
    ).then((results) =>
      results.filter((module): module is string => module !== null)
    );
  }
}
