import { Injectable } from '@nestjs/common';

import { CreateCampaignDto } from '../dto/create-campaign.dto';
// import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { CampaignsMongoRepository } from '../repositories/mongo/campaigns.repository';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly campaignsMongoRepository: CampaignsMongoRepository,
  ) {}

  async create(createCampaignDto: CreateCampaignDto) {
    const campaign = await this.campaignsMongoRepository.create(
      createCampaignDto,
    );
    return { campaign };
  }

  async findAll() {
    const campaigns = await this.campaignsMongoRepository.findAll();
    return { campaigns };
  }

  async findOne(id: string) {
    const campaign = await this.campaignsMongoRepository.findOne(id);
    return { campaign };
  }

  // update(id: number, updateCampaignDto: UpdateCampaignDto) {
  //   return `This action updates a #${id} campaign`;
  // }
}
