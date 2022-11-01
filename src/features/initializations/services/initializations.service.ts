import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { InitializationsMongoRepository } from '../repositories/mongo/initializations.repository';

@Injectable()
export class InitializationsService implements OnApplicationBootstrap {
  constructor(
    private initializationsRepository: InitializationsMongoRepository,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.initializationsRepository.checkCampaignStatuses();
  }
}
