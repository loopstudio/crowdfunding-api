/* eslint-disable @typescript-eslint/no-explicit-any */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { CampaignPledgeMongoRepository } from './campaign-pledge.repository';
import { CampaignPledge } from '../../../schemas/campaign-pledge.schema';
import {
  campaignPledgeMock,
  userMock2,
  aggregateCampaignMock,
} from '../../../tests/mocks';

const user = userMock2;
const page = 1;
const size = 10;

describe('Campaign Pledge Repository', () => {
  let campaignPledgeRepository: CampaignPledgeMongoRepository;
  let campaignPledgeModel: Model<CampaignPledge>;

  const campaignId = '634f3292a486274ca2f3d47f' as unknown as ObjectId;
  const userId = '634f3292a486274ca2f3d47f' as unknown as ObjectId;
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
            aggregate: jest.fn(),
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
  describe('findAll', () => {
    const mockReturnValue = [
      {
        data: [{ campaigns: [aggregateCampaignMock] }],
        count: [{ total: 2 }],
      },
    ];
    it('should call aggregate with the correct parameters', async () => {
      jest
        .spyOn(campaignPledgeModel, 'aggregate')
        .mockReturnValue(mockReturnValue as any);

      const search = '';
      const expectedAggregateParams = [
        {
          $facet: {
            data: [
              { $match: { user: user._id } },
              { $sort: { created_at: -1 } },
              { $skip: 0 },
              { $limit: size },
              {
                $group: {
                  _id: null,
                  campaigns: {
                    $addToSet: '$campaign',
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  campaigns: 1,
                },
              },
              {
                $lookup: {
                  from: 'campaigns',
                  localField: 'campaigns',
                  foreignField: '_id',
                  as: 'campaigns',
                },
              },
              {
                $match: {
                  $or: [
                    { 'campaigns.title': { $regex: search } },
                    { 'campaigns.subtitle': { $regex: search } },
                  ],
                },
              },
            ],
            count: [
              { $match: { user: userId } },
              {
                $group: {
                  _id: null,
                  campaigns: {
                    $addToSet: '$campaign',
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  campaigns: 1,
                },
              },
              {
                $lookup: {
                  from: 'campaigns',
                  localField: 'campaigns',
                  foreignField: '_id',
                  as: 'campaigns',
                },
              },
              {
                $match: {
                  $or: [
                    { 'campaigns.title': { $regex: search } },
                    { 'campaigns.subtitle': { $regex: search } },
                  ],
                },
              },
              { $count: 'total' },
            ],
          },
        },
      ];
      await campaignPledgeRepository.findAll({
        page,
        size,
        userId: user._id,
        search: '',
      });
      expect(campaignPledgeModel.aggregate).toHaveBeenCalledWith(
        expectedAggregateParams,
      );
    });

    it('should return the result of aggregate', async () => {
      const mockReturnValue = [
        {
          data: [{ campaigns: [aggregateCampaignMock] }],
          count: [{ total: 2 }],
        },
      ];
      jest
        .spyOn(campaignPledgeModel, 'aggregate')
        .mockReturnValue(mockReturnValue as any);

      const expectedResult = {
        campaigns: [aggregateCampaignMock],
        total: 2,
      };
      const result = await campaignPledgeRepository.findAll({
        page,
        size,
        userId: user._id,
        search: '',
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
