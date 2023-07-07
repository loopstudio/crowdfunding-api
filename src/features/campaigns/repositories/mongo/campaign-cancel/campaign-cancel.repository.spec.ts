/* eslint-disable @typescript-eslint/no-explicit-any */

import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, ObjectId } from 'mongoose';

import { CampaignCancel } from 'src/features/campaigns/schemas/campaign-cancel.schema';
import { campaignCancelMock } from 'src/features/campaigns/tests/mocks';
import { CampaignCancelMongoRepository } from './campaign-cancel.repository';

describe('Campaign Cancel Mongo Repository', () => {
  let campaignCancelRepository: CampaignCancelMongoRepository;
  let campaignCancelModel: Model<CampaignCancel>;

  const campaignId = '634f3292a486274ca2f3d47f' as unknown as ObjectId;
  const userId = '634f3292a486274ca2f3d47a' as unknown as ObjectId;
  const tokenId = '634f3292a486274ca2f3d47b' as unknown as ObjectId;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignCancelMongoRepository,
        {
          provide: getModelToken(CampaignCancel.name),
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

    campaignCancelRepository = module.get<CampaignCancelMongoRepository>(
      CampaignCancelMongoRepository,
    );
    campaignCancelModel = module.get<Model<CampaignCancel>>(
      getModelToken(CampaignCancel.name),
    );
  });

  it('should be defined', () => {
    expect(campaignCancelRepository).toBeDefined();
  });

  describe('create method', () => {
    it('should call create method without errors', async () => {
      jest
        .spyOn(campaignCancelModel, 'create')
        .mockReturnValue(campaignCancelMock as any);

      const response = await campaignCancelRepository.create({
        campaignId,
        userId,
        tokenId,
      });

      expect(response).toStrictEqual(campaignCancelMock);
    });
  });
});
