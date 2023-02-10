import { Controller, Get, Query, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

import { CampaignPledgeService } from '../../services/campaign-pledge/campaign-pledge.service';
import { APIResponse } from 'src/common/types';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/common/constants';

@Controller('campaigns-pledge')
export class CampaignsPledgeController {
  constructor(private readonly campaignPledgeService: CampaignPledgeService) {}

  @Get()
  async findAllByUser(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Request() request: ExpressRequest | any,
    @Query('size') size: number = DEFAULT_PAGE_SIZE,
    @Query('page') page: number = DEFAULT_PAGE,
  ): Promise<APIResponse> {
    const { user } = request;
    const campaigns = await this.campaignPledgeService.findAllByUser({
      page,
      size,
      user,
    });
    return { data: campaigns };
  }
}
