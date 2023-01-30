import { randomUUID } from 'crypto';

export const getNonce = (): string => {
  return randomUUID();
};

export const getDateFromTimestampOrISO = (date: Date): Date => {
  const transformedDate = isNaN(+date)
    ? new Date(date)
    : new Date(Number(date));

  return transformedDate;
};
