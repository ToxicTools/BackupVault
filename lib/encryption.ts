import crypto from 'crypto';

/**
 * Secure encryption utilities using AES-256-CBC with random IVs
 */

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Derives a proper encryption key from the environment variable
 */
export function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha256');
}

/**
 * Encrypts data with AES-256-CBC using a random IV
 * Returns: IV + encrypted data (both as hex string)
 */
export function encrypt(data: string, encryptionKey: string): string {
  if (!encryptionKey || encryptionKey.length < 32) {
    throw new Error('Encryption key must be at least 32 characters');
  }

  // Generate random IV for each encryption
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create cipher with random IV
  const key = Buffer.from(encryptionKey.slice(0, 32));
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  // Encrypt data
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return IV + encrypted data (both as hex)
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts data encrypted with the encrypt function
 * Expects: IV + encrypted data (separated by :)
 */
export function decrypt(encryptedData: string, encryptionKey: string): string {
  if (!encryptionKey || encryptionKey.length < 32) {
    throw new Error('Encryption key must be at least 32 characters');
  }

  try {
    // Split IV and encrypted data
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      // Try legacy decryption for backward compatibility
      return legacyDecrypt(encryptedData, encryptionKey);
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];

    // Create decipher
    const key = Buffer.from(encryptionKey.slice(0, 32));
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    // Decrypt data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    // Try legacy decryption for backward compatibility
    return legacyDecrypt(encryptedData, encryptionKey);
  }
}

/**
 * Legacy decryption for backward compatibility (insecure - DO NOT USE FOR NEW DATA)
 * @deprecated Use decrypt() instead
 */
function legacyDecrypt(encryptedData: string, encryptionKey: string): string {
  const key = Buffer.from(encryptionKey.slice(0, 32));
  const iv = Buffer.alloc(16, 0); // Legacy zero IV
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Sanitizes file names to prevent path traversal attacks
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Remove special chars
    .replace(/\.\./g, '_') // Remove path traversal
    .slice(0, 255); // Limit length
}

/**
 * Generates a cryptographically secure random string
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
