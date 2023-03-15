export type movementType = 'INCREASE' | 'DECREASE';

export type searchFilters = {
  owner?: string;
  $or?: [
    { title: { $regex: string; $options: string } },
    { subtitle: { $regex: string; $options: string } },
  ];
};

export type OnchainId = string;
