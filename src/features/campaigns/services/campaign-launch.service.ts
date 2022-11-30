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
    // FIXME add succesful and error logs
    const pendingCampaign = await this.campaignService.findByLaunchEvent(
      //FIXME what if is already Active? It should be pending
      //FIXME use right values
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      '100',
      '16686381555',
      '16686481123',
    );

    if (!pendingCampaign) {
      const errorMsg =
        'Pending campaing doesnt exists for event: ' +
        JSON.stringify(eventData);
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const updateStatusDto: UpdateCampaignDto = {
      // FIXME should be constants
      status: {
        name: 'Active',
        code: 'active',
      },
    };

    await this.campaignService.update({
      // Fixme ID?
      id: pendingCampaign.campaign.id,
      updateCampaignDto: updateStatusDto,
    });

    await this.campaignLaunchMongoRepository.create(
      pendingCampaign.campaign.id,
      eventData[0],
    );
  }
}
