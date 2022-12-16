import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Campaign, CampaignDocument } from '../../schemas/campaign.schema';
import { campaignFieldsToModify } from '../../constants';
import { CreateCampaignDto } from '../../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../../dto/update-campaign.dto';

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
    const campaing = await this.campaignModel
      .findOne({ onchainId: onchainId })
      .lean();
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
    - Sorted by created at asc
    This way, if a user creates N campaings with the same parameters, are processed secuentially.
    TODO: In a feature, to improve this mechanism, the contract could receive the backend _id at launch method. This 
    _id could be emmited on Launch event to map the correct campaign
   */
  async findByLaunchEvent(
    ownerId: string,
    amount: string,
    tokenAddress: string,
    pendingStatusId: string,
  ) {
    // TODO Search object id by active text
    const campaing = await this.campaignModel
      .findOne({
        owner: ownerId,
        status: pendingStatusId,
        'goal.amount': amount,
        'goal.token': tokenAddress,
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
      startDate,
      endDate,
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
}
