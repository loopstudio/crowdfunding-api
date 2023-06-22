/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { CampaignRefundMongoRepository } from './campaign-refund.repository';
import { CampaignRefund } from '../../../schemas/campaign-refund.schema';
import { campaignRefundMock } from '../../../tests/mocks';

describe('Campaign Refund Repository', () => {
  let campaignRefundRepository: CampaignRefundMongoRepository;
  let campaignRefundModel: Model<CampaignRefund>;

  const campaignId = '634f3292a486274ca2f3d47f' as unknown as ObjectId;
  const userId = '634f3292a486274ca2f3d47f' as unknown as ObjectId;
  const tokenId = '634f3292a486274ca2f3d47b' as unknown as ObjectId;
  const amount = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignRefundMongoRepository,
        {
          provide: getModelToken(CampaignRefund.name),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    campaignRefundModel = module.get<Model<CampaignRefund>>(
      getModelToken(CampaignRefund.name),
    );
    campaignRefundRepository = module.get<CampaignRefundMongoRepository>(
      CampaignRefundMongoRepository,
    );
  });

  describe('create method', () => {
    it('should call create method without errors', async () => {
      jest
        .spyOn(campaignRefundModel, 'create')
        .mockReturnValue(campaignRefundMock as any);

      const response = await campaignRefundRepository.create({
        campaignId,
        userId,
        tokenId,
        amount,
      });

      expect(response).toStrictEqual(campaignRefundMock);
    });
  });
});
