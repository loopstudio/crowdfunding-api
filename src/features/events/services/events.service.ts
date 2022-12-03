import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseProvider } from '@ethersproject/providers';
import { Contract, getDefaultProvider } from 'ethers';

import { contractsToHandle, eventsToHandle } from 'src/common/contracts';
import { EventsMongoRepository } from '../repositories/mongo/events.repository';
import { CrowdfundingEvent } from '../types';
import { CampaignLaunchService } from 'src/features/campaigns/services/campaign-launch.service';
import { CampaignPledgeService } from 'src/features/campaigns/services/campaign-pledge.service';

@Injectable()
export class EventsService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private provider: BaseProvider = null;
  private contracts: Contract[] = [];

  constructor(
    private configService: ConfigService,
    private eventsMongoRepository: EventsMongoRepository,
    private campaignLaunchService: CampaignLaunchService,
    private campaignPledgeService: CampaignPledgeService,
  ) {}

  onApplicationShutdown() {
    this.provider.removeAllListeners();
  }

  async onApplicationBootstrap() {
    // TODO: Hanlde possible missing events

    this.initializeProvider();
    this.intializeContracts();
    this.intializeListeners();
  }

  private initializeProvider() {
    // TODO: Configure api keys for production (https://docs.ethers.io/v5/api/providers)

    const rpcEndpoint = this.configService.get<string>('NETWORK_RPC_URL');

    this.provider = getDefaultProvider(rpcEndpoint);
  }

  private intializeContracts() {
    for (const contract of contractsToHandle) {
      const { address, abi } = contract;
      const contractToAdd = new Contract(address, abi, this.provider);

      this.contracts.push(contractToAdd);
    }
  }

  private intializeListeners() {
    for (const contract of this.contracts) {
      for (const eventId in eventsToHandle) {
        contract.on(eventId, (...args) =>
          this.handleEvent(eventsToHandle[eventId], contract, [...args]),
        );
      }
    }
  }

  private async handleEvent(
    event: CrowdfundingEvent,
    contract: Contract,
    data: unknown,
  ) {
    switch (event) {
      case CrowdfundingEvent.Launch:
        console.log('The data', data);
        await this.campaignLaunchService.create(data);
        break;
      case CrowdfundingEvent.Pledge:
        await this.campaignPledgeService.create(data);
        break;
    }

    this.storeRawEvent(data, event); //FIXME could process repetead events. storeRawEvent does not distinguish.
  }

  private async storeRawEvent(data: unknown, event: CrowdfundingEvent) {
    if (Array.isArray(data) && data.length) {
      try {
        const transactionData = data[data.length - 1];
        const { blockNumber, blockHash, transactionHash } = transactionData;

        await this.eventsMongoRepository.createEvent({
          event,
          blockNumber,
          blockHash,
          transactionHash,
          data,
        });
      } catch (err) {
        console.log("Event couldn't be processed");
      }
    }
  }
}
