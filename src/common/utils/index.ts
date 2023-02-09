import { randomUUID } from 'crypto';

export const getNonce = (): string => {
  return randomUUID();
};
