import { Request } from 'express';

import { mongoBuiltToken } from 'src/features/tokens/tests/mocks';

const onchainId = 1;
const userAddress = '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189123';
const amount = 1;

export const mongoCampaignLaunch = {
  _id: '6367be0422ca99a33946949b',
  onchainId: '2',
  campaignId: '1',
  save: jest.fn().mockReturnValue(null),
};

export const mongoBuiltCampaign = {
  _id: '6367be0422ca99a33946949b',
  title: 'My campaign',
  subtitle: 'An amazing campaign',
  story: 'This is the long short story: We need the money',
  startDate: '2022-11-06T14:01:36.850+0000',
  endDate: '2022-11-06T15:00:36.850+0000',
  onchainId: null,
  fiatAmount: 0,
  image: 'image.png',
  video: 'video.mp4',
  backers: [],
  status: '63611e68143b8def9c4843cf',
  goal: [
    {
      amount: '1000000000000000000',
      tokenAddress: mongoBuiltToken.address,
      _id: '6367be0422ca99a33946949d',
    },
  ],
  currentAmount: [
    {
      amount: '0',
      tokenAddress: mongoBuiltToken.address,
      _id: '6367be0422ca99a33946949d',
    },
  ],
  category: '63611e69143b8def9c4843d9',
  owner: '634dd92c34361cf5a21fb96b',
  created: '2022-11-06T14:00:36.947+0000',
  updated: '2022-11-06T14:00:36.947+0000',
  __v: 0,
  save: jest.fn().mockReturnValue(null),
};

export const mongoBuiltUpdatedCampaign = {
  _id: '6367be0422ca99a33946949b',
  title: 'My updated campaign',
  subtitle: 'An amazing updated campaign',
  story: 'This is the long short story: We need the money updated ',
  startDate: '2022-11-06T14:01:36.850+0000',
  endDate: '2022-11-06T15:00:36.850+0000',
  onchainId: null,
  fiatAmount: 0,
  image: 'updatedImage.png',
  video: 'updatedVideo.mp4',
  backers: [],
  status: '63611e68143b8def9c4843cf',
  goal: [
    {
      amount: '1000000000000000000',
      tokenAddress: mongoBuiltToken.address,
      _id: '6367be0422ca99a33946949d',
    },
  ],
  currentAmount: [
    {
      amount: '0',
      tokenAddress: mongoBuiltToken.address,
      _id: '6367be0422ca99a33946949d',
    },
  ],
  category: '63611e69143b8def9c4843d9',
  owner: '634dd92c34361cf5a21fb96b',
  created: '2022-11-06T14:00:36.947+0000',
  updated: '2022-11-06T14:00:36.947+0000',
  __v: 0,
  save: jest.fn().mockReturnValue(null),
};

export const createCampaignDtoMock = {
  title: 'My campaign',
  subtitle: 'An amazing campaign',
  story: 'This is the long short story: We need the money',
  startDate: new Date(Date.now() + 1),
  endDate: new Date(Date.now() + 10),
  image: 'image.png',
  video: 'video.mp4',
  goal: [
    {
      tokenAddress: '63611e69143b8def9c4843dd',
      amount: '100',
    },
  ],
  category: '63611e69143b8def9c4843d9',
  status: '',
  onchainId: '',
};

export const createCampaignDtoWithOwnerMock = {
  ...createCampaignDtoMock,
  owner: '63611e69143b8def9c484310',
};

export const updateCampaignDtoMock = {
  title: 'My updated campaign',
  subtitle: 'An amazing updated campaign',
  story: 'This is the long short story: We need the money updated ',
  image: 'updatedImage.png',
  video: 'updatedVideo.mp4',
};

export const updateCampaignDtoWithOwnerMock = {
  ...updateCampaignDtoMock,
  owner: '63611e69143b8def9c484310',
};

export const launchEventData = [
  '1',
  '1000000000000000000',
  '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  '1636242896',
  '1636246496',
];

export const mongoLaunchedCampaign = {
  _id: '6367be0422ca99a33946949b',
  title: 'My campaign',
  subtitle: 'An amazing campaign',
  story: 'This is the long short story: We need the money',
  startDate: '2022-11-06T14:01:36.850+0000',
  endDate: '2022-11-06T15:00:36.850+0000',
  onchainId: '1',
  fiatAmount: 0,
  image: 'image.png',
  video: 'video.mp4',
  backers: [],
  status: '73611e68143b8def9c4843de',
  goal: [
    {
      amount: '1000000000000000000',
      tokenAddress: mongoBuiltToken.address,
      _id: '6367be0422ca99a33946949d',
    },
  ],
  currentAmount: [
    {
      amount: '0',
      tokenAddress: mongoBuiltToken.address,
      _id: '6367be0422ca99a33946949d',
    },
  ],
  category: '63611e69143b8def9c4843d9',
  owner: '634dd92c34361cf5a21fb96b',
  created: '2022-11-06T14:00:36.947+0000',
  updated: '2022-11-06T14:00:36.947+0000',
  __v: 0,
  save: jest.fn().mockReturnValue(null),
};

export const campaignPledgeArgumentMock = [onchainId, userAddress, amount];
export const campaignClaimArgumentMock = [onchainId, userAddress, amount];

export const userMock = {
  username: 'rcargnelutti',
  email: 'rcargnelutti@loopstudio.dev',
  nonce: 721102917354423900,
  publicAddress: '0xD890357F631d209FB3eFabc116cE211111111111',
  _id: '634f3292a486274ca2f3d47f',
  created: '2022-10-18T23:11:14.611Z',
  updated: '2022-10-18T23:11:14.611Z',
  __v: 0,
};

export const userMock2 = {
  username: 'rcargnelutti',
  email: 'rcargnelutti@loopstudio.dev',
  nonce: '721102917354423900',
  publicAddress: '0xD890357F631d209FB3eFabc116cE211111111111',
  _id: '634f3292a486274ca2f3d47f',
  __v: 0,
};

export const aggregateCampaignMock = {
  _id: '63e3cf5e686d726c68efa3fa',
  title: 'My campaign',
  subtitle: 'An amazing campaign',
  story: 'This is the long short story: We need the money',
  startDate: '2023-02-08T16:36:22.533Z',
  endDate: '2023-02-08T17:35:22.533Z',
  onchainId: null,
  fiatAmount: 0,
  image: 'image.png',
  video: 'video.mp4',
  backers: [],
  status: '63dbc2df5c10658a2d65877c',
  goal: [
    {
      amount: '100',
      tokenAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      _id: '63e3cf5e686d726c68efa3fb',
    },
  ],
  currentAmount: [
    {
      amount: '0',
      _id: '63e3cf5e686d726c68efa3fc',
    },
  ],
  category: '63dbc2df5c10658a2d658789',
  owner: '63dbba0551b0303e137fd1b4',
  created: '2023-02-08T16:35:42.339Z',
  updated: '2023-02-08T16:35:42.339Z',
  __v: 0,
};

export const tokenMock = {
  _id: '63611e69143b8def9c4843dd',
  name: 'LoopToken',
  symbol: 'LT',
  address: '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189123',
  created: '2022-11-01T13:26:01.032+0000',
  updated: '2022-11-01T13:26:01.032+0000',
  __v: 0,
};

export const campaignPledgeMock = {
  _id: '639b969369bed1e35eeca7a5',
  campaign: '638e605ab710197625b571be',
  user: '634dd92c34361cf5a21fb96b',
  token: '63611e69143b8def9c4843dd',
  amount: '1000000000000000000',
  date: '2022-12-15T21:50:11.066+0000',
  created: '2022-12-15T21:50:11.072+0000',
  updated: '2022-12-15T21:50:11.072+0000',
  __v: 0,
};

export const campaignClaimMock = {
  _id: '639b969369bed1e35eeca7aa',
  campaign: '638e605ab710197625b571ba',
  user: '634dd92c34361cf5a21fb96a',
  token: '63611e69143b8def9c4843da',
  amount: '2000000000000000000',
  date: '2023-01-15T21:50:11.066+0000',
  created: '2023-01-12T21:50:11.072+0000',
  updated: '2023-11-12T21:50:11.072+0000',
  __v: 0,
};

export const campaignLaunchEventDto = {
  creator: launchEventData[2],
  goal: launchEventData[1],
  tokenAddress: mongoBuiltToken.address,
  startDate: launchEventData[3],
  endDate: launchEventData[4],
};

export const findCampaignToLaunchData = {
  campaignLaunchEventDto,
  pendingStatusId: '63611e68143b8def9c4843cf',
  ownerId: '634dd92c34361cf5a21fb96b',
};

export const requestWithUser = {
  user: { ...userMock },
} as unknown as Request;

export const mongoClaimedCampaingStatus = {
  _id: '73611e68143b8def9c4843de',
  name: 'Claimed',
  code: 'claimed',
  created: '2022-10-18T23:11:14.611Z',
  updated: '2022-10-18T23:11:14.611Z',
  __v: 0,
};
