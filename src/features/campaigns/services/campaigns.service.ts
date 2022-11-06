import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateCampaignDto } from '../dto/create-campaign.dto';
// import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { CampaignsMongoRepository } from '../repositories/mongo/campaigns.repository';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { CampaignStatusService } from 'src/features/campaignStatuses/services/campaign-statuses.service';

import { pendingStatusCode } from '../../campaignStatuses/types/index';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly campaignsMongoRepository: CampaignsMongoRepository,
    private readonly tokensService: TokensService,
    private readonly campaignStatusService: CampaignStatusService,
  ) {}

  async create(createCampaignDto: CreateCampaignDto) {
    const tokensIds = createCampaignDto.goal.map((tokenGoal) => {
      return tokenGoal.token as unknown as string;
    });
    const areTokensValid = await this.tokensService.areTokensValid(tokensIds);
    if (!areTokensValid) {
      throw new BadRequestException();
    }

    const pendingStatus = await this.campaignStatusService.getStatusByCode(
      pendingStatusCode,
    );
    if (!pendingStatus) {
      throw new BadRequestException();
    }

    // TODO: Add category validation!!!!

    const campaign = await this.campaignsMongoRepository.create({
      dto: createCampaignDto,
      pendingStatusId: pendingStatus._id,
    });

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
