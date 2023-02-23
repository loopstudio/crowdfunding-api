// This value is associated with the one defined on the Crowdfunding contract
// You should check it there before changing it here
export const maxCampaignDurationInDays = 60;
export const maxCampaignDurationInMs =
  maxCampaignDurationInDays * 24 * 60 * 60 * 1000;

export const campaignFieldsToModify = [
  'title',
  'subtitle',
  'story',
  'image',
  'video',
  'status',
  'onchainId',
];

export type movementType = 'INCREASE' | 'DECREASE';
export enum movementTypeEnum {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

export type searchFilters = {
  owner?: string;
  $or?: [
    { title: { $regex: string; $options: string } },
    { subtitle: { $regex: string; $options: string } },
  ];
};
