import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CampaignStatusRepository } from 'src/features/campaign-statuses/repositories/mongo/campaign-status.repository';
import { activeStatusCode } from 'src/features/campaign-statuses/types';
import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { CampaignLaunchMongoRepository } from '../repositories/mongo/campaign-launch.repository';

@Injectable()
export class CampaignLaunchService {
  private readonly logger = new Logger(CampaignLaunchService.name);

  constructor(
    private readonly campaignService: CampaignsService,
    private readonly campaignLaunchMongoRepository: CampaignLaunchMongoRepository,
    private readonly campaignStatusRepository: CampaignStatusRepository,
  ) {}

  async create(eventData: unknown) {
    if (!Array.isArray(eventData)) {
      throw new Error('Event data is corrupted');
    }

    const [onchainId, goal, creator, startDate, endDate] = eventData;
    this.logger
      .log(`Processing launch event. onchainId ${onchainId}, goal: ${goal}, 
    creator: ${creator}, startDate: ${startDate}, endDate: ${endDate},`);

    // FIXME add succesful and error logs
    try {
      // FIXME discuss dates. Dats are not stored ... trazability?
      const pendingCampaign = await this.campaignService.findByLaunchEvent(
        creator,
        goal,
        '638749e585e016f7996e493b', // FIXME use get by default
      );

      const activeStatus = await this.campaignStatusRepository.getStatusByCode(
        activeStatusCode,
      );
      const updateStatusDto: UpdateCampaignDto = {
        status: activeStatus._id,
        onchainId: eventData[0],
      };

      await this.campaignService.update({
        id: pendingCampaign.campaign.id,
        updateCampaignDto: updateStatusDto,
      });

      await this.campaignLaunchMongoRepository.create(
        pendingCampaign.campaign.id,
        eventData[0],
      );
    } catch (err) {
      if (err.status === HttpStatus.NOT_FOUND) {
        const errorMsg =
          'Pending campaing doesnt exists for event: ' +
          JSON.stringify(eventData);
        this.logger.error(errorMsg);
      } else {
        throw new InternalServerErrorException(err);
      }
    }
  }
}
