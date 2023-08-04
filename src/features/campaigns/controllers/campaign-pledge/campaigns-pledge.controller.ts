import { Controller, Get, Query } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { CampaignPledgeService } from '../../services/campaign-pledge/campaign-pledge.service';
import { APIResponse } from 'src/common/types';
import { CampaignPledgeQueryDto } from '../../dto/campaigns-pledge-query-dto';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { MINT_MANAGEMENT_QUEUE } from 'src/common/constants';

@Controller('campaigns-pledge')
export class CampaignsPledgeController {
  constructor(private readonly campaignPledgeService: CampaignPledgeService) {}

  @Get()
  async findAllByUser(
    @CurrentUser() user,
    @Query() query: CampaignPledgeQueryDto,
  ): Promise<APIResponse> {
    const { page, size, search } = query;
    const { _id: userId } = user;

    const campaigns = await this.campaignPledgeService.findAllByUser({
      page,
      size,
      userId,
      search,
    });
    return { data: campaigns };
  }

  @EventPattern(MINT_MANAGEMENT_QUEUE)
  async handleMint(data) {
    console.log('Received data: ', data);
  }
}
