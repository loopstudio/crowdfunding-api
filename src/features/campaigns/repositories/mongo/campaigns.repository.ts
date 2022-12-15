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
    - Same start and end date
    - Pending status
    - Sorted by created at asc
    This way, if a user creates N campaings with the same parameters, are processed secuentially.
   */
  async findByLaunchEvent(
    ownerId: string,
    amount: string,
    startDate: string,
    endDate: string,
    tokenAddress: string,
  ) {
    // TODO Search object id by active text
    const campaing = await this.campaignModel
      .findOne({
        owner: ownerId,
        status: '638749e585e016f7996e492f', // FIXME
        'goal.amount': amount,
        'goal.token': tokenAddress,
        //startDate: startDate, // FIXME 1970-07-13T03:08:01.123Z, should we store timestamps?
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
        // FIXME this is error prone
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
