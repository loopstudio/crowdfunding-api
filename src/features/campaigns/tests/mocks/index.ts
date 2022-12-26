export const mongoCampaignLaunch = {
  _id: '6367be0422ca99a33946949b',
  onchainId: '2',
  campaignId: '1',
  save: jest.fn().mockReturnValue(null),
};

export const mongoBuiltCampaign = {
  _id: '6367be0422ca99a33946949b',
  title: 'My campaign',
  subtitle: 'An amazing campaign',
  story: 'This is the long short story: We need the money',
  startDate: '2022-11-06T14:01:36.850+0000',
  endDate: '2022-11-06T15:00:36.850+0000',
  onchainId: null,
  fiatAmount: 0,
  image: 'image.png',
  video: 'video.mp4',
  backers: [],
  status: '63611e68143b8def9c4843cf',
  goal: [
    {
      amount: '1000000000000000000',
      tokenAddress: '0xF2f5C73fa04406b1995e397B55c24aB1f3eA726C',
      _id: '6367be0422ca99a33946949d',
    },
  ],
  currentAmount: [
    {
      amount: '0',
      tokenAddress: '0xF2f5C73fa04406b1995e397B55c24aB1f3eA726C',
      _id: '6367be0422ca99a33946949d',
    },
  ],
  category: '63611e69143b8def9c4843d9',
  owner: '634dd92c34361cf5a21fb96b',
  created: '2022-11-06T14:00:36.947+0000',
  updated: '2022-11-06T14:00:36.947+0000',
  __v: 0,
  save: jest.fn().mockReturnValue(null),
};

export const mongoBuiltUpdatedCampaign = {
  _id: '6367be0422ca99a33946949b',
  title: 'My updated campaign',
  subtitle: 'An amazing updated campaign',
  story: 'This is the long short story: We need the money updated ',
  startDate: '2022-11-06T14:01:36.850+0000',
  endDate: '2022-11-06T15:00:36.850+0000',
  onchainId: null,
  fiatAmount: 0,
  image: 'updatedImage.png',
  video: 'updatedVideo.mp4',
  backers: [],
  status: '63611e68143b8def9c4843cf',
  goal: [
    {
      amount: '1000000000000000000',
      tokenAddress: '0xF2f5C73fa04406b1995e397B55c24aB1f3eA726C',
      _id: '6367be0422ca99a33946949d',
    },
  ],
  currentAmount: [
    {
      amount: '0',
      tokenAddress: '0xF2f5C73fa04406b1995e397B55c24aB1f3eA726C',
      _id: '6367be0422ca99a33946949d',
    },
  ],
  category: '63611e69143b8def9c4843d9',
  owner: '634dd92c34361cf5a21fb96b',
  created: '2022-11-06T14:00:36.947+0000',
  updated: '2022-11-06T14:00:36.947+0000',
  __v: 0,
  save: jest.fn().mockReturnValue(null),
};

export const createCampaignDtoMock = {
  title: 'My campaign',
  subtitle: 'An amazing campaign',
  story: 'This is the long short story: We need the money',
  startDate: new Date(Date.now() + 1),
  endDate: new Date(Date.now() + 10),
  image: 'image.png',
  video: 'video.mp4',
  goal: [
    {
      tokenAddress: '63611e69143b8def9c4843dd',
      amount: '100',
    },
  ],
  category: '63611e69143b8def9c4843d9',
  status: '',
  onchainId: '',
};

export const updateCampaignDtoMock = {
  title: 'My updated campaign',
  subtitle: 'An amazing updated campaign',
  story: 'This is the long short story: We need the money updated ',
  image: 'updatedImage.png',
  video: 'updatedVideo.mp4',
};

export const launchEventData = [
  '1',
  '1000000000000000000',
  '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  '1636242896',
  '1636246496',
];

export const mongoLaunchedCampaign = {
  _id: '6367be0422ca99a33946949b',
  title: 'My campaign',
  subtitle: 'An amazing campaign',
  story: 'This is the long short story: We need the money',
  startDate: '2022-11-06T14:01:36.850+0000',
  endDate: '2022-11-06T15:00:36.850+0000',
  onchainId: '1',
  fiatAmount: 0,
  image: 'image.png',
  video: 'video.mp4',
  backers: [],
  status: '73611e68143b8def9c4843de',
  goal: [
    {
      amount: '1000000000000000000',
      tokenAddress: '0xF2f5C73fa04406b1995e397B55c24aB1f3eA726C',
      _id: '6367be0422ca99a33946949d',
    },
  ],
  currentAmount: [
    {
      amount: '0',
      tokenAddress: '0xF2f5C73fa04406b1995e397B55c24aB1f3eA726C',
      _id: '6367be0422ca99a33946949d',
    },
  ],
  category: '63611e69143b8def9c4843d9',
  owner: '634dd92c34361cf5a21fb96b',
  created: '2022-11-06T14:00:36.947+0000',
  updated: '2022-11-06T14:00:36.947+0000',
  __v: 0,
  save: jest.fn().mockReturnValue(null),
};
