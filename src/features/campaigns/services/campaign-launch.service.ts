import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
    console.log('----> Event data ', eventData);
    // FIXME add succesful and error logs
    try {
      const pendingCampaign = await this.campaignService.findByLaunchEvent(
        //FIXME what if is already Active? It should be pending
        //FIXME use right values
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        '100',
        '16686381555', //FIXME
        '16686481123', //FIXME
        '638749e585e016f7996e493b', // FIXME use token address not token id. Depends on https://github.com/loopstudio/crowdfunding-api/pull/13
      );

      const updateStatusDto: UpdateCampaignDto = {
        status: '638749e585e016f7996e4930', // FIXME use object id?
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

      // TODO al recibir la cam
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
