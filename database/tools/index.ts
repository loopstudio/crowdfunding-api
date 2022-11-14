import mongoose from 'mongoose';

import { CampaignStatusSchema } from '../../src/features/campaign-statuses/schemas/campaign-status.schema';
import { CampaignCategorySchema } from '../../src/features/campaign-categories/schemas/campaign-category.schema';
import { TokenSchema } from '../../src/features/tokens/schemas/token.schema';

// !IMPORTANT: You need to add the connection string right below
const MONGO_URI_CONNECTION = '';

const log = (message) => {
  console.log(`${new Date().toISOString()} >>> ${message}`);
};

const CampaignStatusModel = mongoose.model(
  'CampaignStatus',
  CampaignStatusSchema,
);
const CampaignCategoryModel = mongoose.model(
  'CampaignCategory',
  CampaignCategorySchema,
);
const TokenModel = mongoose.model('Token', TokenSchema);

const checkCampaignStatuses = async () => {
  log('Check campaign statuses');
  const campaignStatusesCount = await CampaignStatusModel.count();
  if (campaignStatusesCount > 0) {
    return log('Campaigns statuses already created \n');
  }

  const predefinedCampaignStatuses = [
    {
      name: 'Pending',
      code: 'pending',
    },
    {
      name: 'Active',
      code: 'active',
    },
    {
      name: 'Started',
      code: 'started',
    },
    {
      name: 'Claimed',
      code: 'claimed',
    },
    {
      name: 'Finished',
      code: 'finished',
    },
    {
      name: 'Canceled',
      code: 'canceled',
    },
  ];
  await CampaignStatusModel.insertMany(predefinedCampaignStatuses);
  log('Campaigns statuses created successfully');

  log('Check campaign statuses done \n');
};

const checkCampaignCategories = async () => {
  log('Check campaign categories');
  const campaignCategoriesCount = await CampaignCategoryModel.count();
  if (campaignCategoriesCount > 0) {
    return log('Campaigns categories already created \n');
  }

  const predefinedCampaignCategories = [
    {
      name: 'General',
      code: 'general',
    },
  ];
  await CampaignCategoryModel.insertMany(predefinedCampaignCategories);
  log('Campaigns categories created successfully');

  log('Check campaign categories done \n');
};

const checkTokens = async () => {
  log('Check tokens');
  const tokensCount = await TokenModel.count();
  if (tokensCount > 0) {
    return log('Tokens already created \n');
  }

  // TODO: Modify these values according to the context
  const predefinedTokens = [
    {
      name: 'LoopToken',
      symbol: 'LT',
      address: '0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413',
    },
  ];
  await TokenModel.insertMany(predefinedTokens);
  log('Tokens created successfully');

  log('Check tokens done \n');
};

(async () => {
  if (!MONGO_URI_CONNECTION) {
    log(
      'Please, fill in the MONGO_URI_CONNECTION constant where the value in your .env file',
    );
    log(
      'Notice that if you are using Docker, you should change the container name to localhost because this script is run outside the container network',
    );
    process.exit(1);
  }

  log('Initializing DB connection');
  await mongoose.connect(MONGO_URI_CONNECTION);
  log('DB connection initialized \n');

  await checkCampaignStatuses();
  await checkCampaignCategories();
  await checkTokens();

  log('Process finished successfully');
  process.exit(0);
})();
