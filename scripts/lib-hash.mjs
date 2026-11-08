import { createHash } from 'node:crypto';

// SHA-256 over bytes with CRLF normalised to LF, so hashes are identical on
// Windows (autocrlf) and Linux checkouts. Mirrors scripts/build-catalog.py.
export function sha256Lf(bytes) {
  const text = Buffer.from(bytes).toString('latin1').replace(/\r\n/g, '\n');
  return createHash('sha256').update(Buffer.from(text, 'latin1')).digest('hex');
}
