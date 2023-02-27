import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';

import { Campaign, CampaignDocument } from '../../schemas/campaign.schema';
import { campaignFieldsToModify, movementTypeEnum } from '../../constants';
import { movementType, searchFilters } from '../../types';
import { CreateCampaignDto } from '../../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../../dto/update-campaign.dto';
import { CampaignLaunchEventDto } from '../../dto/campaign-launch-event-dto';

@Injectable()
export class CampaignsMongoRepository {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  async findAll({
    page,
    size,
    ownerId,
    search,
  }: {
    page: number;
    size: number;
    ownerId: string | null;
    search: string | null;
  }) {
    const skipValue = page > 0 ? (page - 1) * size : 0;
    const filters: searchFilters = {};

    if (ownerId) {
      filters.owner = ownerId;
    }

    filters.$or = [
      { title: { $regex: search, $options: 'i' } },
      { subtitle: { $regex: search, $options: 'i' } },
    ];

    const campaings = await this.campaignModel
      .find(filters)
      .populate('owner')
      .sort({ created: -1 })
      .skip(skipValue)
      .limit(size)
      .lean();

    return campaings;
  }

  async findOne(onchainId: string) {
    const campaing = await this.campaignModel
      .findOne({ onchainId: onchainId })
      .populate('owner');

    if (!campaing) {
      throw new NotFoundException();
    }
    return campaing;
  }

  /*
   Finds campaign based on contract event, considering
    - Same creator address
    - Same goal
    - Pending status
    = Start and end date
    - Sorted by created at asc
    This way, if a user creates N campaings with the same parameters, are processed secuentially.
    TODO: In a feature, to improve this mechanism, the contract could receive the backend _id at launch method. This
    _id could be emmited on Launch event to map the correct campaign
   */
  async findByLaunchEvent(findCampaignToLaunchData: {
    campaignLaunchEventDto: CampaignLaunchEventDto;
    pendingStatusId: string;
    ownerId: string;
  }) {
    const campaing = await this.campaignModel
      .findOne({
        owner: findCampaignToLaunchData.ownerId,
        status: findCampaignToLaunchData.pendingStatusId,
        'goal.amount': findCampaignToLaunchData.campaignLaunchEventDto.goal,
        'goal.tokenAddress':
          findCampaignToLaunchData.campaignLaunchEventDto.tokenAddress,
        startDate: new Date(
          Number(findCampaignToLaunchData.campaignLaunchEventDto.startDate) *
            1000,
        ),
        endDate: new Date(
          Number(findCampaignToLaunchData.campaignLaunchEventDto.endDate) *
            1000,
        ),
      })
      .sort({ created: 'ascending' });

    if (!campaing) {
      throw new NotFoundException();
    }

    return campaing;
  }

  async create(createCampaignData: {
    dto: CreateCampaignDto;
    pendingStatusId: string;
    generalCategoryId: string;
    owner: string;
  }) {
    const {
      generalCategoryId,
      owner,
      pendingStatusId,
      dto: { title, subtitle, story, startDate, endDate, image, video, goal },
    } = createCampaignData;

    const currentAmount = goal.map((tokenAmount) => ({
      token: tokenAmount.tokenAddress,
      amount: 0,
    }));

    const campaign = await this.campaignModel.create({
      title,
      subtitle,
      story,
      image,
      video,
      goal,
      owner,
      startDate,
      endDate,
      status: pendingStatusId,
      currentAmount,
      category: generalCategoryId,
    });

    return campaign;
  }

  async update({
    id,
    updateCampaignDto,
  }: {
    id: string;
    updateCampaignDto: UpdateCampaignDto;
  }) {
    const existingCampaign = await this.campaignModel
      .findOne({ _id: id })
      .exec();
    if (!existingCampaign) {
      throw new NotFoundException();
    }

    // TODO: Move to utils
    for (const [key, value] of Object.entries(updateCampaignDto)) {
      if (campaignFieldsToModify.includes(key)) {
        existingCampaign[key] = value;
      } else {
        throw new InternalServerErrorException(
          'Trying to update an unaccepted campaign field: ',
          key,
        );
      }
    }

    await existingCampaign.save();
    return existingCampaign;
  }

  async updateTokenAmount({
    campaignId,
    amountToChange,
    tokenAddress,
    action,
  }: {
    campaignId: string;
    amountToChange: BigNumber;
    tokenAddress: string;
    action: movementType;
  }): Promise<void> {
    const campaign = await this.findOne(campaignId);
    const tokenIndex = campaign.currentAmount.findIndex(
      (token) => token.tokenAddress === tokenAddress,
    );

    if (tokenIndex >= 0) {
      const currentValue = parseEther(
        campaign.currentAmount[tokenIndex].amount,
      );

      campaign.currentAmount[tokenIndex].amount =
        action === movementTypeEnum.INCREASE
          ? formatEther(currentValue.add(amountToChange))
          : formatEther(currentValue.sub(amountToChange));

      await campaign.save();
    }
  }
}
