import { Injectable } from '@nestjs/common';

import { CampaignStatusRepository } from '../repositories/mongo/campaign-status.repository';
import { CampaignStatusDocument } from '../schemas/campaign-status.schema';

@Injectable()
export class CampaignStatusService {
  constructor(private campaignStatusRepository: CampaignStatusRepository) {}

  async getStatusByCode(code: string): Promise<CampaignStatusDocument> {
    const status = await this.campaignStatusRepository.getStatusByCode(code);
    return status;
  }
}
