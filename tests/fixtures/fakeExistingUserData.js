// Mock data for Create user controller

module.exports.fakeConfirmedUser = {
  _id: '6425f7dc26290bd07413c039',
  name: 'Spencer',
  email: 'spencerdispenced@gmail.com',
  isValid: true,
  confirmationCode: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  uuid: 'c4fce95f0546e9fd8dcc821cc6449c43200ecac4e0',
};

module.exports.fakeUnconfirmedUser = {
  _id: '6425f7dc26290bd07413c039',
  name: 'Spencer',
  email: 'spencerdispenced@gmail.com',
  isValid: false,
  confirmationCode: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  uuid: 'c4fce95f0546e9fd8dcc821cc6449c43200ecac4e0',
};
