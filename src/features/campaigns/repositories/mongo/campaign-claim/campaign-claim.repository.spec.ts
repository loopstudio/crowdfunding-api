/* eslint-disable @typescript-eslint/no-explicit-any */

import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, ObjectId } from 'mongoose';

import { CampaignClaim } from 'src/features/campaigns/schemas/campaign-claim.schema';
import { campaignClaimMock } from 'src/features/campaigns/tests/mocks';
import { CampaignClaimMongoRepository } from './campaign-claim.repository';

describe('Campaign Claim Mongo Repository', () => {
  let campaignClaimRepository: CampaignClaimMongoRepository;
  let campaignClaimModel: Model<CampaignClaim>;

  const campaignId = '634f3292a486274ca2f3d47f' as unknown as ObjectId;
  const userId = '634f3292a486274ca2f3d47a' as unknown as ObjectId;
  const tokenId = '634f3292a486274ca2f3d47b' as unknown as ObjectId;
  const amount = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignClaimMongoRepository,
        {
          provide: getModelToken(CampaignClaim.name),
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

    campaignClaimRepository = module.get<CampaignClaimMongoRepository>(
      CampaignClaimMongoRepository,
    );
    campaignClaimModel = module.get<Model<CampaignClaim>>(
      getModelToken(CampaignClaim.name),
    );
  });

  it('should be defined', () => {
    expect(campaignClaimRepository).toBeDefined();
  });

  describe('create method', () => {
    it('should call create method without errors', async () => {
      jest
        .spyOn(campaignClaimModel, 'create')
        .mockReturnValue(campaignClaimMock as any);

      const response = await campaignClaimRepository.create({
        campaignId,
        userId,
        tokenId,
        amount,
      });

      expect(response).toStrictEqual(campaignClaimMock);
    });
  });
});
