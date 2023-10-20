import { UploadClient } from '@uploadcare/upload-client';

export const client = new UploadClient({
  publicKey: process.env.UPLOADCARE_API_KEY || '',
});
