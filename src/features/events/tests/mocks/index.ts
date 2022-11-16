import { CrowdfundingEvent } from '../../types';

export const createEventDto = {
  event: CrowdfundingEvent.Launch,
  blockNumber: 1,
  blockHash:
    '0x9816fe2049e950c722ffeaad72bd615db96e34dc06e255ea0d781531b007c705',
  transactionHash:
    '0x9816fe2049e950c722ffeaad72bd615db96e34dc06e255ea0d7815312307c123',
  data: null,
};

export const createdEvent = {
  event: CrowdfundingEvent.Launch,
  blockNumber: 1,
  blockHash:
    '0x9816fe2049e950c722ffeaad72bd615db96e34dc06e255ea0d781531b007c705',
  transactionHash:
    '0x9816fe2049e950c722ffeaad72bd615db96e34dc06e255ea0d7815312307c123',
  data: null,
  date: new Date('11/16/2022'),
  created: new Date('11/16/2022'),
  updated: new Date('11/16/2022'),
  __v: 0,
};
