import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseProvider } from '@ethersproject/providers';
import { Contract, getDefaultProvider } from 'ethers';

import { contractsToHandle, eventsToHandle } from 'src/common/contracts';

@Injectable()
export class EventsService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private provider: BaseProvider = null;
  private contracts: Contract[] = [];

  constructor(private configService: ConfigService) {}

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

    const ethereumNetwork = this.configService.get<string>(
      'ETHEREUM_NETWORK_URL',
    );

    this.provider = getDefaultProvider(ethereumNetwork);
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
        console.log(
          `registering ${eventsToHandle[eventId]} - ${eventId}: for contract ${contract}`,
        );

        contract.on(eventId, (...args) =>
          this.handleEvent(eventsToHandle[eventId], contract, [...args]),
        );
      }
    }
  }

  private handleEvent(event: string, contract: Contract, data: unknown) {
    // TODO: Call features services to handle the event
    console.log(`Handle event ${event} for contract ${contract.address}`);
    console.log(`Data ${data}`);
  }
}
