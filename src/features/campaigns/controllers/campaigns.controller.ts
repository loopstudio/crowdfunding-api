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
import { APIResponse } from 'src/common/types';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/common/constants';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
  ): Promise<APIResponse> {
    const { campaign } = await this.campaignsService.create(createCampaignDto);
    return { data: campaign };
  }

  @Get()
  async findAll(
    @Query('size') size = DEFAULT_PAGE_SIZE,
    @Query('page') page = DEFAULT_PAGE,
  ): Promise<APIResponse> {
    const { campaigns } = await this.campaignsService.findAll({ page, size });
    return { data: campaigns };
  }

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
