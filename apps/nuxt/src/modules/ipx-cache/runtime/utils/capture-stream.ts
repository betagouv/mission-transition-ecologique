import { Writable } from 'node:stream';

export class CaptureStream extends Writable {
  private chunks: Buffer[];

  constructor(options?: any) {
    super(options);
    this.chunks = [];
  }

  override _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    this.chunks.push(
      Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding)
    );
    callback();
  }

  getBuffer(): Buffer {
    return Buffer.concat(this.chunks);
  }
}
