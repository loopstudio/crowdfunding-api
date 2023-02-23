import { randomUUID } from 'crypto';

export const getNonce = (): string => {
  return randomUUID();
};

export const decodeJwt = (token: string) => {
  const base64Url = token.split('.')[1];
  const buff = Buffer.from(base64Url, 'base64');
  const payloadinit = buff.toString('ascii');
  return JSON.parse(payloadinit);
};
