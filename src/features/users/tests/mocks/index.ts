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

export const userCampaignMock = {
  _id: '634f3292a486274ca2f3d47f',
  totalPledged: '1',
  pledges: [pledgeMock._id],
  save: jest.fn(),
} as unknown as UserCampaign;
