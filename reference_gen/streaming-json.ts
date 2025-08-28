/**
 * Streaming JSON writer for large documentation files
 */

export class StreamingJsonWriter {
  private encoder = new TextEncoder();
  private file!: Deno.FsFile;
  private isFirstItem = true;

  constructor(private filePath: string) {}

  async open() {
    this.file = await Deno.create(this.filePath);
    await this.writeRaw("{");
  }

  async writeProperty(key: string, value: unknown) {
    if (!this.isFirstItem) {
      await this.writeRaw(",");
    }
    this.isFirstItem = false;

    const keyStr = JSON.stringify(key);
    const valueStr = JSON.stringify(value);

    await this.writeRaw(`${keyStr}:${valueStr}`);
  }

  async writeBatch(entries: Record<string, unknown>) {
    for (const [key, value] of Object.entries(entries)) {
      await this.writeProperty(key, value);
    }
  }

  async close() {
    await this.writeRaw("}");
    this.file.close();
  }

  private async writeRaw(data: string) {
    await this.file.write(this.encoder.encode(data));
  }
}

export async function writeJsonInChunks(
  filePath: string,
  data: Record<string, unknown>,
  chunkSize: number = 100,
) {
  const writer = new StreamingJsonWriter(filePath);
  await writer.open();

  const entries = Object.entries(data);
  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    const chunkObj = Object.fromEntries(chunk);
    await writer.writeBatch(chunkObj);

    // Yield control periodically
    if (i % (chunkSize * 5) === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  await writer.close();
}
