import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';

import { CampaignsService } from '../services/campaigns.service';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { CampaignQueryDto } from '../dto/campaigns-query-dto';
import { APIResponse } from 'src/common/types';
import {
  Public,
  AllowUnauthenticatedRequest,
} from 'src/features/auth/decorators';
import { CurrentUser } from 'src/decorators/currentUser.decorator';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  async create(
    @CurrentUser() user,
    @Body() createCampaignDto: CreateCampaignDto,
  ): Promise<APIResponse> {
    const { _id: owner } = user;

    const { campaign } = await this.campaignsService.create({
      owner,
      ...createCampaignDto,
    });

    return { data: campaign };
  }

  @AllowUnauthenticatedRequest()
  @Get()
  async findAll(
    @CurrentUser() user,
    @Query() query: CampaignQueryDto,
  ): Promise<APIResponse> {
    const { page, size, search, own } = query;
    let ownerId: string | null = null;
    if (user && own) {
      const { _id: owner } = user;
      ownerId = owner;
    }

    const { campaigns } = await this.campaignsService.findAll({
      page,
      size,
      ownerId,
      search,
    });

    return { data: campaigns };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<APIResponse> {
    const { campaign } = await this.campaignsService.findOne(id);
    return { data: campaign };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    const { campaign } = await this.campaignsService.update({
      id,
      updateCampaignDto,
    });
    return { data: campaign };
  }
}
