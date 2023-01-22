import { createHash } from 'crypto';

export const generateMD5 = (value: string): string => {
  return createHash('md5').update(value).digest('hex');
};
