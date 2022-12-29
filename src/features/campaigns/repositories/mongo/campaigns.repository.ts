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
import {
  campaignFieldsToModify,
  movementType,
  movementTypeEnum,
} from '../../constants';
import { CreateCampaignDto } from '../../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../../dto/update-campaign.dto';
import { CampaignLaunchEventDto } from '../../dto/campaign-launch-event-dto';

@Injectable()
export class CampaignsMongoRepository {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
  ) {}

  async findAll({ page, size }: { page: number; size: number }) {
    const skipValue = page > 0 ? (page - 1) * size : 0;

    const campaings = await this.campaignModel
      .find()
      .sort({ created: -1 })
      .skip(skipValue)
      .limit(size)
      .lean();

    return campaings;
  }

  async findOne(onchainId: string) {
    const campaing = await this.campaignModel.findOne({ onchainId: onchainId });
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
          Number(findCampaignToLaunchData.campaignLaunchEventDto.startDate),
        ),
        endDate: new Date(
          Number(findCampaignToLaunchData.campaignLaunchEventDto.endDate),
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
  }) {
    // FIXME: Assign logged in user
    const owner = '634dd92c34361cf5a21fb96b';

    const {
      dto: { title, subtitle, story, startDate, endDate, image, video, goal },
      pendingStatusId,
      generalCategoryId,
    } = createCampaignData;

    const currentAmount = goal.map((tokenAmount) => ({
      token: tokenAmount.tokenAddress,
      amount: 0,
    }));

    const campaign = await this.campaignModel.create({
      title,
      subtitle,
      story,
      startDate: new Date(Number(startDate)),
      endDate: new Date(Number(endDate)),
      image,
      video,
      status: pendingStatusId,
      goal,
      currentAmount,
      category: generalCategoryId,
      owner,
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
