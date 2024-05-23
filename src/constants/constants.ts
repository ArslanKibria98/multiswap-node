import moment from 'moment';
var crypto = require('crypto');
var CryptoJS = require('crypto-js');

export const NAME = 'FUND_MANAGER';
export const VERSION = '000.004';
export const CONTRACT_ADDRESS = '0x9aFe354fb34a6303a9b9C89fF43A509A5320ba2D';
export const BEARER = 'Bearer ';
export const RANDOM_KEY =
  'AnanlJwzC/5MKcsT5nMr25zLrXIBx13byMYNKcXDp0ppI4Dn5YTQtU2WNp9PAKGi';
export const CUDOS_CHAIN_ID = 'cudos-1';
export const FOUNDARY = 'Foundary';
export const ONE_INCH = '1Inch';
export const NUMBER_OF_VALIDATORS_SHOULD_BE = 1;
export const NETWORKS = [
  {
    chainId: '1',
    fundManagerAddress: '0x5eBeF0bD015e4fAfe64172Ae00b9bB46a05906a7',
    fiberRouterAddress: '0x4B87Ab46B56990Aff03dAD1caFEb33e760879d97',
    foundaryTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    aggregateRouterContractAddress: '',
  },
  {
    chainId: '56',
    fundManagerAddress: '0x033Af723ce4D799FBeD58a4a53754efaA4b0Fdae',
    fiberRouterAddress: '0x30Bf6F2Ed9a7b060c777cE8FEf07cF5993525CF0',
    foundaryTokenAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    aggregateRouterContractAddress:
      '0x111111125421ca6dc452d289314280a0f8842a65',
    cctpFundManager: '',
  },
  {
    chainId: '42161',
    fundManagerAddress: '0x106E2eF36123Cb573d0925C1f4a3b377d11CBF70',
    fiberRouterAddress: '0xDf5Df008Fa3397ac0Bd895A1aFDBda0231D883e0',
    foundaryTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    aggregateRouterContractAddress:
      '0x111111125421ca6dc452d289314280a0f8842a65',
    cctpFundManager: '0x5aC3e55B1582A27E9B734679708210e1b84818C4',
  },
  {
    chainId: '10',
    fundManagerAddress: '0x7655eE1bd794b0Fe4b9B4D477B0F5cCABD78137c',
    fiberRouterAddress: '0x6a34da798839964e14850F585187f3d28079a500',
    foundaryTokenAddress: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    aggregateRouterContractAddress: '',
  },
  {
    chainId: '43114',
    fundManagerAddress: '0x41eFd89cbeaCeCdf72d3fD8321C53A69A132CC1a',
    fiberRouterAddress: '0x9cc84e262E3A2A6b8C257d493E3d3487495fb5a2',
    foundaryTokenAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    aggregateRouterContractAddress: '',
  },
  {
    chainId: '8453',
    fundManagerAddress: '0xdE3a9704bb91117c040b23c03beb11124FD22882',
    fiberRouterAddress: '0x877BA251159a8128741eE0cE9E1951E96Ec10477',
    foundaryTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    aggregateRouterContractAddress:
      '0x111111125421ca6dc452d289314280a0f8842a65',
    cctpFundManager: '0x5729c1d7E75Dad6B44e10965e063A3a006cC5c5a',
  },
  {
    chainId: '324',
    fundManagerAddress: '0x9524aA7870CE93b73AFc31a7D3Bf9808513Dd25f',
    fiberRouterAddress: '0xB1b56b46A7961a1797dcA7eaF58d28903DA6623A',
    foundaryTokenAddress: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
    aggregateRouterContractAddress:
      '0x6fd4383cb451173d5f9304f041c7bcbf27d561ff',
  },
  {
    chainId: '534352',
    fundManagerAddress: '0xC7b23d5Da44f3d421aD27863788bEdcce4b34B0d',
    fiberRouterAddress: '0x90b4C9Cc6AAf15be692d20D409A86bd32897D9b1',
    foundaryTokenAddress: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
    aggregateRouterContractAddress:
      '0x6131B5fae19EA4f9D964eAc0408E4408b66337b5',
  },
];

const getAllowedPublicAddress = function (): [] {
  let allowedAddress = process.env.ALLOWED_VALIDATOR_ADDRESSES;
  if (allowedAddress) {
    let allowedAddressInArray: [] = JSON.parse(
      allowedAddress ? allowedAddress : '',
    );
    return allowedAddressInArray;
  }
  return [];
};

export const isAllowedPublicAddress = function (nodeAddress: string): boolean {
  let allowedAddress = getAllowedPublicAddress();
  if (allowedAddress && allowedAddress?.length > 0) {
    for (let index = 0; index < allowedAddress.length; index++) {
      let address: string = allowedAddress[index];
      if (nodeAddress?.toLowerCase() == address?.toLowerCase()) {
        return true;
      }
    }
  }
  return false;
};

export const isUniqueAddressesArray = function (arr: [any]): boolean {
  var tmpArr = [];
  if (arr?.length > 0) {
    for (var obj in arr) {
      if (tmpArr.indexOf(arr[obj]?.address?.toLowerCase()) < 0) {
        tmpArr.push(arr[obj]?.address?.toLowerCase());
      } else {
        return false;
      }
    }
  }
  return true;
};

export const checkForNumberOfValidators = function (arr: any): boolean {
  if (arr?.length > 0 && arr?.length == getAllowedPublicAddress().length) {
    return true;
  }
  return false;
};

export const createAuthTokenForMultiswapBackend = function () {
  let timelapse = 1;
  let currentTime = new Date();
  let startDateTime = moment(currentTime)
    .subtract('minutes', timelapse)
    .utc()
    .format();
  let endDateTime = moment(currentTime)
    .add('minutes', timelapse)
    .utc()
    .format();
  let randomKey = crypto.randomBytes(512).toString('hex');
  let tokenBody: any = {};
  tokenBody.startDateTime = startDateTime;
  tokenBody.endDateTime = endDateTime;
  tokenBody.randomKey = randomKey;

  let strTokenBody = JSON.stringify(tokenBody);
  let apiKey = process.env.API_KEY as string;
  let encryptedSessionToken = encrypt(strTokenBody, apiKey);
  return encryptedSessionToken;
};

export const getPrivateKey = function () {
  const privateKey = process.env.PRIVATE_KEY as string;
  const securityKey = process.env.SECURITY_KEY as string;
  return decrypt(privateKey, securityKey);
};

export const encrypt = function (data: string, key: String) {
  try {
    var ciphertext = CryptoJS.AES.encrypt(data, key).toString();
    return ciphertext;
  } catch (e) {
    console.log(e);
    return '';
  }
};

export const decrypt = function (data: string, key: string) {
  try {
    var bytes = CryptoJS.AES.decrypt(data, key);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (e) {
    console.log(e);
    return '';
  }
};

export const delay = function () {
  return new Promise(resolve => {
    setTimeout(resolve, 30000);
  });
};

export const getThreshold = function (threshold: number) {
  return threshold * 2;
};

export const getRpcNodesData = function () {
  let data = process.env.RPC_NODES;
  if (data) {
    data = JSON.parse(data ? data : '');
  }
  return data;
};
