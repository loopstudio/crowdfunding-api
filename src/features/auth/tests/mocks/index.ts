export const mongoBuiltUser = {
  username: 'rcargnelutti',
  email: 'rcargnelutti@loopstudio.dev',
  nonce: 721102917354423900,
  publicAddress: '0xD890357F631d209FB3eFabc116cE211111111111',
  _id: '634f3292a486274ca2f3d47f',
  created: '2022-10-18T23:11:14.611Z',
  updated: '2022-10-18T23:11:14.611Z',
  __v: 0,
};

export const createUserDTO = {
  username: 'rcargnelutti',
  email: 'rcargnelutti@loopstudio.dev',
  publicAddress: '0xD890357F631d209FB3eFabc116cE211111111111',
};

export const generatedJWT = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
};

export const userLoginData = {
  signature:
    '0x27876c5cc1be67e8313633ab0f72ace790886c88a664df1ca0b858c1834782002a0ae1e44fdb3fe7586eec431c115205a36a05bbd31c6c2bce04605825e91cfe1b',
  publicAddress: '0xE0dEc290373abd36164C61A7d737f4e309d0Ec41',
};

export const mongoUserWithFunctions = {
  ...mongoBuiltUser,
  updateNonce: jest.fn().mockResolvedValue(null),
  generateJWT: jest.fn().mockResolvedValue(generatedJWT.accessToken),
  save: jest.fn().mockResolvedValue(null),
  toJSON: jest.fn().mockResolvedValue(mongoBuiltUser),
};
