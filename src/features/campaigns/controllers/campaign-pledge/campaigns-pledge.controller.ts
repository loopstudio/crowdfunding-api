import { Controller, Get, Query } from '@nestjs/common';

import { CampaignPledgeService } from '../../services/campaign-pledge/campaign-pledge.service';
import { APIResponse } from 'src/common/types';
import { CampaignPledgeQueryDto } from '../../dto/campaigns-pledge-query-dto';
import { CurrentUser } from 'src/decorators/currentUser.decorator';

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
    console.log(query);
    const campaigns = await this.campaignPledgeService.findAllByUser({
      page,
      size,
      userId,
      search,
    });
    return { data: campaigns };
  }
}
