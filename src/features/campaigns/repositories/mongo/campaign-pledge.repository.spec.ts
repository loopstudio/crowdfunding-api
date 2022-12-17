/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { CampaignPledgeMongoRepository } from './campaign-pledge.repository';
import { CampaignPledge } from '../../schemas/campaign-pledge.schema';
import { campaignPledgeMock } from '../../tests/mocks';

describe('Campaign Statuses Repository', () => {
  let campaignPledgeRepository: CampaignPledgeMongoRepository;
  let campaignPledgeModel: Model<CampaignPledge>;

  const campaignId = '634f3292a486274ca2f3d47f' as unknown as ObjectId;
  const userId = '634f3292a486274ca2f3d47a' as unknown as ObjectId;
  const tokenId = '634f3292a486274ca2f3d47b' as unknown as ObjectId;
  const amount = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignPledgeMongoRepository,
        {
          provide: getModelToken(CampaignPledge.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            sort: jest.fn(),
            skip: jest.fn(),
            limit: jest.fn(),
            lean: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignPledgeModel = module.get<Model<CampaignPledge>>(
      getModelToken(CampaignPledge.name),
    );
    campaignPledgeRepository = module.get<CampaignPledgeMongoRepository>(
      CampaignPledgeMongoRepository,
    );
  });

  describe('create method', () => {
    it('should call create method without errors', async () => {
      jest
        .spyOn(campaignPledgeModel, 'create')
        .mockReturnValue(campaignPledgeMock as any);

      const response = await campaignPledgeRepository.create({
        campaignId,
        userId,
        tokenId,
        amount,
      });

      expect(response).toStrictEqual(campaignPledgeMock);
    });
  });
});
