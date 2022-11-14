import { utils as EthersUtils } from 'ethers';

import { EventType } from 'src/features/events/types';

export const eventsToHandle = {
  // event Launch(uint256 id, uint256 goal, address indexed creator, uint64 startDate, uint64 endDate);
  [EthersUtils.id('Launch(uint256,uint256,address,uint64,uint64)')]:
    EventType.Launch,
  // event Cancel(uint256 id);
  [EthersUtils.id('Cancel(uint256)')]: EventType.Cancel,
  // event Pledge(uint256 id, address indexed pledger, uint256 amount);
  [EthersUtils.id('Pledge(uint256,address,uint256)')]: EventType.Pledge,
  //event Unpledge(uint256 id, address indexed pledger, uint256 amount);
  [EthersUtils.id('Unpledge(uint256,address,uint256)')]: EventType.Unpledge,
  // event Refund(uint256 id, address indexed pledger, uint256 amount);
  [EthersUtils.id('Refund(uint256,address,uint256)')]: EventType.Refund,
  // event Claim(uint256 id, address indexed creator, uint256 amount);
  [EthersUtils.id('Claim(uint256,address,uint256)')]: EventType.Claim,
};

export const contractsToHandle = [
  {
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_token',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: '_maxCampaignDurationInDays',
            type: 'uint64',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
        ],
        name: 'Cancel',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'Claim',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'goal',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint64',
            name: 'startDate',
            type: 'uint64',
          },
          {
            indexed: false,
            internalType: 'uint64',
            name: 'endDate',
            type: 'uint64',
          },
        ],
        name: 'Launch',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'pledger',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'Pledge',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'pledger',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'Refund',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'pledger',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'Unpledge',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_campaignId',
            type: 'uint256',
          },
        ],
        name: 'cancel',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_campaignId',
            type: 'uint256',
          },
        ],
        name: 'claim',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'idsToCampaigns',
        outputs: [
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'goalAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'pledgedAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint64',
            name: 'startDate',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'endDate',
            type: 'uint64',
          },
          {
            internalType: 'enum Crowdfunding.CampaignStatus',
            name: 'status',
            type: 'uint8',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'idsToPledgedAmountByAddress',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_goalAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint64',
            name: '_startDate',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: '_endDate',
            type: 'uint64',
          },
        ],
        name: 'launch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'maxCampaignDurationInDays',
        outputs: [
          {
            internalType: 'uint64',
            name: '',
            type: 'uint64',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_campaignId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_amount',
            type: 'uint256',
          },
        ],
        name: 'pledge',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_campaignId',
            type: 'uint256',
          },
        ],
        name: 'refund',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'tokenAddress',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_campaignId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_amount',
            type: 'uint256',
          },
        ],
        name: 'unpledge',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  },
];
