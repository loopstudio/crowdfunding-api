import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { CampaignsService } from '../services/campaigns.service';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
// import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { APIResponse } from 'src/common/types';

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
  async findAll(): Promise<APIResponse> {
    const { campaigns } = await this.campaignsService.findAll();
    return { data: campaigns };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<APIResponse> {
    const { campaign } = await this.campaignsService.findOne(id);
    return { data: campaign };
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCampaignDto: UpdateCampaignDto,
  // ) {
  //   return this.campaignsService.update(+id, updateCampaignDto);
  // }
}
