import crypto from 'node:crypto';
import { promises as fs } from 'fs';

export async function generateFileHash(filePath: string): Promise<string> {
  const fileBuffer = await fs.readFile(filePath);
  return generateBufferHash(fileBuffer);
}

export function generateBufferHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
