import { CampaignClaimDocument } from './../../../campaigns/schemas/campaign-claim.schema';
import { CampaignPledgeDocument } from 'src/features/campaigns/schemas/campaign-pledge.schema';
import { CampaignDocument } from 'src/features/campaigns/schemas/campaign.schema';
import { TokenDocument } from 'src/features/tokens/schemas/token.schema';
import { UserCampaign } from '../../schemas/user-campaign.schema';
import { UserDocument } from '../../schemas/user.schema';

export const mongoBuiltUser = {
  username: 'rcargnelutti',
  email: 'rcargnelutti@loopstudio.dev',
  nonce: 721102917354423900,
  publicAddress: '0xD890357F631d209FB3eFabc116cE211111111111',
  _id: '634f3292a486274ca2f3d47f',
  created: '2022-10-18T23:11:14.611Z',
  updated: '2022-10-18T23:11:14.611Z',
  __v: 0,
};

export const createUserDTO = {
  username: 'rcargnelutti',
  email: 'rcargnelutti@loopstudio.dev',
  publicAddress: '0xD890357F631d209FB3eFabc116cE211111111111',
};

export const tokenMock = {
  _id: '634f3292a486274ca2f3d47f',
  address: '0xD890357F631d209FB3eFabc116cE211111111123',
} as TokenDocument;

export const campaignMock = {
  _id: '634f3292a486274ca2f3d47f',
  onchainId: 'LT',
} as CampaignDocument;

export const userMock = {
  _id: '634f3292a486274ca2f3d47f',
  publicAddress: '0xD890357F631d209FB3eFabc116cE211111111111',
} as UserDocument;

export const pledgeMock = {
  _id: '634f3292a486274ca2f3d47f',
  amount: '1',
} as CampaignPledgeDocument;

export const claimMock = {
  _id: '634f3292a486274ca2f3d47f',
  amount: '1',
} as CampaignClaimDocument;

export const userCampaignMock = {
  _id: '634f3292a486274ca2f3d47f',
  claims: [claimMock._id],
  pledges: [pledgeMock._id],
  totalPledged: '1',
  totalClaimed: '1',
  save: jest.fn(),
} as unknown as UserCampaign;

export const userLoginData = {
  signature:
    '0x27876c5cc1be67e8313633ab0f72ace790886c88a664df1ca0b858c1834782002a0ae1e44fdb3fe7586eec431c115205a36a05bbd31c6c2bce04605825e91cfe1b',
  publicAddress: '0xE0dEc290373abd36164C61A7d737f4e309d0Ec41',
};

export const generatedJWT = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
};

export const mongoUserWithFunctions = {
  ...mongoBuiltUser,
  updateNonce: jest.fn().mockResolvedValue(null),
  generateJWT: jest.fn().mockResolvedValue(generatedJWT.accessToken),
  save: jest.fn().mockResolvedValue(null),
};
