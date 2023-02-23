import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

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
    @Request() request: ExpressRequest,
    @Body() createCampaignDto: CreateCampaignDto,
  ): Promise<APIResponse> {
    const {
      user: { _id: owner },
    } = request;

    const { campaign } = await this.campaignsService.create({
      owner,
      ...createCampaignDto,
    });

    return { data: campaign };
  }

  @Get()
  async findAll(
    @Request() request: ExpressRequest,
    @Query('size') size = DEFAULT_PAGE_SIZE,
    @Query('page') page = DEFAULT_PAGE,
    @Query('own') own = false,
    @Query('search') search = null,
  ): Promise<APIResponse> {
    const {
      user: { _id: owner },
    } = request;
    const ownerId = own ? owner : null;

    const { campaigns } = await this.campaignsService.findAll({
      page,
      size,
      ownerId,
      search,
    });

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
