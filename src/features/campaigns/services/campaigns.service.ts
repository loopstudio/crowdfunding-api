import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { CampaignsMongoRepository } from '../repositories/mongo/campaigns.repository';
import { TokensService } from 'src/features/tokens/services/tokens.service';
import { CampaignStatusService } from 'src/features/campaign-statuses/services/campaign-statuses.service';
import { CampaignCategoriesService } from 'src/features/campaign-categories/services/campaign-category.service';

import {
  pendingStatusCode,
  generalCategoryCode,
} from '../../campaign-statuses/types/index';
import { UsersRepository } from 'src/features/users/repositories/users/mongo/users.repository';
import { CampaignLaunchEventDto } from '../dto/campaign-launch-event-dto';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly campaignsMongoRepository: CampaignsMongoRepository,
    private readonly usersMongoRepository: UsersRepository,
    private readonly tokensService: TokensService,
    private readonly campaignCategoriesService: CampaignCategoriesService,
    private readonly campaignStatusService: CampaignStatusService,
  ) {}

  async create(createCampaignDto: CreateCampaignDto & { owner: string }) {
    const { goal, owner } = createCampaignDto;
    const tokenAddresses = goal.map((tokenGoal) => {
      return tokenGoal.tokenAddress as unknown as string;
    });
    const areTokensValid = await this.tokensService.areTokensValid(
      tokenAddresses,
    );
    if (!areTokensValid) {
      throw new BadRequestException();
    }

    const pendingStatus = await this.campaignStatusService.getStatusByCode(
      pendingStatusCode,
    );
    if (!pendingStatus) {
      throw new BadRequestException();
    }

    const generalCategory = await this.campaignCategoriesService.getByIdOrCode({
      code: generalCategoryCode,
    });
    if (!generalCategory) {
      throw new BadRequestException();
    }

    const campaign = await this.campaignsMongoRepository.create({
      owner,
      dto: createCampaignDto,
      pendingStatusId: pendingStatus._id,
      generalCategoryId: generalCategory._id,
    });

    return { campaign };
  }

  async findAll({ page, size }: { page: number; size: number }) {
    const campaigns = await this.campaignsMongoRepository.findAll({
      page,
      size,
    });

    return { campaigns };
  }

  async findOne(id: string) {
    const campaign = await this.campaignsMongoRepository.findOne(id);
    return { campaign };
  }

  async findByLaunchEvent(campaignLaunchEventDto: CampaignLaunchEventDto) {
    const user = await this.usersMongoRepository.findByAddress(
      campaignLaunchEventDto.creator,
    );
    if (!user) {
      throw new NotFoundException(
        'User not found when processing launch event. Address: ',
        campaignLaunchEventDto.creator,
      );
    }

    const pendingStatus = await this.campaignStatusService.getStatusByCode(
      pendingStatusCode,
    );
    if (!pendingStatus) {
      throw new NotFoundException(
        'Pending status not found when processing launch event',
      );
    }

    const campaign = await this.campaignsMongoRepository.findByLaunchEvent({
      campaignLaunchEventDto,
      pendingStatusId: pendingStatus._id,
      ownerId: user._id,
    });

    return { campaign };
  }

  async update({
    id,
    updateCampaignDto,
  }: {
    id: string;
    updateCampaignDto: UpdateCampaignDto;
  }) {
    const campaign = await this.campaignsMongoRepository.update({
      id,
      updateCampaignDto,
    });

    return { campaign };
  }
}
