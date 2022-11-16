import { Injectable, Logger } from '@nestjs/common';
import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { CampaignLaunchMongoRepository } from '../repositories/mongo/campaign-launch.repository';

@Injectable()
export class CampaignLaunchService {
  private readonly logger = new Logger(CampaignLaunchService.name);

  constructor(
    private readonly campaignService: CampaignsService,
    private readonly campaignLaunchMongoRepository: CampaignLaunchMongoRepository,
  ) {}

  async create(eventData: unknown) {
    this.logger.log('Handling Launch event: ', eventData);
    // FIXME add succesful and error logs
    // TODO: find campaing by address, end date, start date and amount.
    const pendingCampaign = await this.campaignService.findOne('1'); // Fixme

    // If not exists, raise and log error
    if (!pendingCampaign) {
      const errorMsg =
        'Pending campaing doesnt exists for event: ' +
        JSON.stringify(eventData);
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Mark as active
    const updateStatusDto: UpdateCampaignDto = {
      // FIXME should be constants
      status: {
        name: 'Active',
        code: 'active',
      },
    };
    await this.campaignService.update({
      // Fixme ID?
      id: '1',
      updateCampaignDto: updateStatusDto,
    });

    // Store event
    await this.campaignLaunchMongoRepository.create('1', eventData['id']); // FIXME ID?
  }
}
