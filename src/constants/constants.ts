import moment from 'moment';
var crypto = require('crypto');
var CryptoJS = require('crypto-js');

export const NAME = 'FERRUM_TOKEN_BRIDGE_POOL';
export const VERSION = '000.004';
export const CONTRACT_ADDRESS = '0x9aFe354fb34a6303a9b9C89fF43A509A5320ba2D';
export const BEARER = 'Bearer ';
export const RANDOM_KEY =
  'AnanlJwzC/5MKcsT5nMr25zLrXIBx13byMYNKcXDp0ppI4Dn5YTQtU2WNp9PAKGi';
export const CUDOS_CHAIN_ID = 'cudos-1';
export const THRESHOLD = 360;
export const NUMBER_OF_VALIDATORS_SHOULD_BE = 1;
export const NETWORKS = [
  {
    chainId: '56',
    fundManagerAddress: '0x00656E8fccF62aDb64e07A6bd0a967d97CaA0271',
    fiberRouterAddress: '0x7721658936bf9A3c32286127C7Bd1927aa84b11E',
    foundaryTokenAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  },
  {
    chainId: '250',
    fundManagerAddress: '0x354CBFc2894d45a584a9Fd0223cf58495cE3cF7F',
    fiberRouterAddress: '0xAA209557B51C28a8D050fB500e67498EB3d1d92b',
    foundaryTokenAddress: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  },
  {
    chainId: '137',
    fundManagerAddress: '0xD1Fa7F32550a0008b187D7ee3284529338A4A3cF',
    fiberRouterAddress: '0xb6Ca3Fee4AF23D86De7A53DF9BB9324A715CbA93',
    foundaryTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  },
  {
    chainId: '42161',
    fundManagerAddress: '0xcfddF60db000D49d0F2dafd7eDB08Fca177F1A1E',
    fiberRouterAddress: '0x0d618f4632C135e05d9fD795bab021e7DD3187c4',
    foundaryTokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  },
  {
    chainId: '43114',
    fundManagerAddress: '0x81A536479Af0FE02Ec2aC6BB59Db305aa72a774f',
    fiberRouterAddress: '0x066599eD3abB7Eaf517119d376254af13871e5B1',
    foundaryTokenAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  },
  {
    chainId: '245022934',
    fundManagerAddress: '0xE6ff690CC7B91A2B626F7A76Fe507028bc1Eb12D',
    fiberRouterAddress: '0x2234157B16637AfA6f1A7C1C34b1b80D82b50D82',
    foundaryTokenAddress: '0xea6b04272f9f62f997f666f07d3a974134f7ffb9',
  },
];
export const isAllowedPublicAddress = function (nodeAddress: string): boolean {
  let allowedAddress = process.env.ALLOWED_VALIDATOR_ADDRESS;
  if (allowedAddress) {
    let allowedAddressInArray = JSON.parse(
      allowedAddress ? allowedAddress : '',
    );
    if (allowedAddressInArray?.length > 0) {
      for (let index = 0; index < allowedAddressInArray.length; index++) {
        let address = allowedAddressInArray[index];
        if (nodeAddress?.toLowerCase() == address?.toLowerCase()) {
          return true;
        }
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
  if (arr?.length > 0 && arr?.length == NUMBER_OF_VALIDATORS_SHOULD_BE) {
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
  let encryptedSessionToken = encrypt(
    strTokenBody,
    (global as any).AWS_ENVIRONMENT.API_KEY,
  );
  return encryptedSessionToken;
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
    console.log('decrypt error', e);
    return '';
  }
};
