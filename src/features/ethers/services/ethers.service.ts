import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseProvider } from '@ethersproject/providers';
import { Contract, getDefaultProvider } from 'ethers';

@Injectable()
export class EthersService implements OnApplicationBootstrap {
  private provider: BaseProvider = null;
  private contracts: Contract[] = [];

  constructor(private configService: ConfigService) {}

  onApplicationBootstrap() {
    console.log('Initialize provider and event listeners');

    // Step 1: initialize provider (delete this once we implement it)
    this.initializeProvider();

    // Step 2: initialize contracts (delete this once we implement it)
    this.intializeContracts();

    // Step 3: initialize listeners (delete this once we implement it)
    this.intializeListeners();
  }

  private initializeProvider() {
    // TODO: Configure api keys for production
    const alchemyApiKey = this.configService.get<string>('ALCHEMY_API_KEY');
    // TODO: Configure network
    const ethereumNetwork = this.configService.get<string>(
      'ETHEREUM_NETWORK_URL',
    );

    this.provider = getDefaultProvider(ethereumNetwork, {
      alchemy: alchemyApiKey,
    });
  }

  private intializeContracts() {
    // TODO: Read config files
    const contracts = [1, 2, 3];

    for (const contract of contracts) {
      console.log(`Add contract: ${contract}`);

      // const contractToAdd = new ethers.Contract(contractAddress, abi, provider);
      // contractToAdd.attach(contractAddress);
      // this.contracts.push(contractToAdd);
    }
  }

  private intializeListeners() {
    // TODO: Define events as a constant
    const eventsToWatch = ['on_new_campaign'];

    for (const contract of this.contracts) {
      for (const event of eventsToWatch) {
        contract.on(event, () => {
          console.log(
            `Register event listener ${event} for contract ${contract}`,
          );

          this.handleEvent(event, contract);
        });
      }
    }

    // TODO: Remove event listener when shutting down
  }

  private handleEvent(event: string, contract: Contract) {
    // TODO: Call features services to handle the event
    console.log(`Handle event ${event} for contract ${contract}`);
  }
}
