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
      amount: '0',
      token: '63611e69143b8def9c4843dd',
      _id: '6367be0422ca99a33946949d',
    },
  ],
  currentAmount: [
    {
      amount: '0',
      token: '63611e69143b8def9c4843dd',
      _id: '6367be0422ca99a33946949d',
    },
  ],
  category: '63611e69143b8def9c4843d9',
  owner: '634dd92c34361cf5a21fb96b',
  created: '2022-11-06T14:00:36.947+0000',
  updated: '2022-11-06T14:00:36.947+0000',
  __v: 0,
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
      token: '63611e69143b8def9c4843dd',
      amount: '100',
    },
  ],
  category: '63611e69143b8def9c4843d9',
};
