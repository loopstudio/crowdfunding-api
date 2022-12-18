import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CampaignStatusRepository } from 'src/features/campaign-statuses/repositories/mongo/campaign-status.repository';
import { activeStatusCode } from 'src/features/campaign-statuses/types';
import { CampaignsService } from 'src/features/campaigns/services/campaigns.service';
import { TokenRepository } from 'src/features/tokens/repositories/mongo/tokens.repository';
import { TokenDocument } from 'src/features/tokens/schemas/token.schema';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { CampaignLaunchMongoRepository } from '../repositories/mongo/campaign-launch.repository';

@Injectable()
export class CampaignLaunchService {
  private readonly logger = new Logger(CampaignLaunchService.name);

  constructor(
    private readonly campaignService: CampaignsService,
    private readonly campaignLaunchMongoRepository: CampaignLaunchMongoRepository,
    private readonly campaignStatusRepository: CampaignStatusRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async create(eventData: unknown) {
    if (!Array.isArray(eventData)) {
      throw new Error('Event data is corrupted');
    }
    const [onchainId, goal, creator, startDate, endDate] = eventData;
    this.logger
      .log(`Processing launch event. onchainId ${onchainId}, goal: ${goal}, 
    creator: ${creator}, startDate: ${startDate}, endDate: ${endDate},`);
    try {
      const token =
        (await this.tokenRepository.getByDefault()) as TokenDocument; // FIXME can we make standard the promises returned by the repositories? Documents?
      const pendingCampaign = await this.campaignService.findByLaunchEvent(
        creator,
        goal,
        token._id,
        startDate,
        endDate,
      );

      const activeStatus = await this.campaignStatusRepository.getStatusByCode(
        activeStatusCode,
      );

      const updateStatusDto: UpdateCampaignDto = {
        status: activeStatus._id,
        onchainId,
      };

      await this.campaignService.update({
        id: pendingCampaign.campaign.id,
        updateCampaignDto: updateStatusDto,
      });

      await this.campaignLaunchMongoRepository.create(
        pendingCampaign.campaign.id,
        onchainId,
      );

      this.logger
        .log(`Succesfuly processed launch event. onchainId ${onchainId}, goal: ${goal}, 
    creator: ${creator}, startDate: ${startDate}, endDate: ${endDate},`);
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
