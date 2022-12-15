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
import { start } from 'repl';
import { UsersRepository } from 'src/features/users/repositories/users/mongo/users.repository';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly campaignsMongoRepository: CampaignsMongoRepository,
    private readonly usersMongoRepository: UsersRepository,
    private readonly tokensService: TokensService,
    private readonly campaignCategoriesService: CampaignCategoriesService,
    private readonly campaignStatusService: CampaignStatusService,
  ) {}

  async create(createCampaignDto: CreateCampaignDto) {
    const { goal } = createCampaignDto;

    const tokensIds = goal.map((tokenGoal) => {
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

    const generalCategory = await this.campaignCategoriesService.getByIdOrCode({
      code: generalCategoryCode,
    });
    if (!generalCategory) {
      throw new BadRequestException();
    }

    const campaign = await this.campaignsMongoRepository.create({
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

  /*
   Finds campaign based on contract event, considering
    - Same creator address
    - Same goal
    - Same start and end date
    - Sorted by created at asc
    This way, if a user creates N campaings with the same parameters, are processed secuentially.
   */
  async findByLaunchEvent(
    address: string,
    goal: string,
    startDate: string,
    endDate: string,
  ) {
    const user = await this.usersMongoRepository.findByAddress(address);
    if (!user) {
      throw new NotFoundException(
        'User not found when processing launch event. Address: ',
        address,
      );
    }
    const campaign = await this.campaignsMongoRepository.findByLaunchEvent(
      user._id,
      goal,
      startDate,
      endDate,
    );

    return { campaign }; //TODO why this?
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
