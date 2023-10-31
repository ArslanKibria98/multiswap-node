import Web3 from 'web3';
import { TransactionReceipt, Transaction } from '../interfaces';
const { SigningCosmWasmClient } = require('@cosmjs/cosmwasm-stargate');
import { Wallet, ethers } from 'ethers';
// import ethers from 'ethers';
import { CUDOS_CHAIN_ID } from '../constants/constants';

export const getTransactionReceipt = async (
  txId: string,
  rpcURL: string,
): Promise<TransactionReceipt> => {
  let client = await SigningCosmWasmClient.connectWithSigner(rpcURL);
  let transaction = await client.getTx(txId);
  console.log('transaction', transaction);
  if (!transaction || transaction === null) {
    await getTransactionReceipt(txId, rpcURL);
  }
  return transaction;
};

export const signedTransaction = async (
  job: any,
  decodedData: any,
  transaction: any,
): Promise<any> => {
  try {
    const destinationAmountToMachine = await getDestinationAmount(job.data);
    const txData = {
      transactionHash: job.returnvalue.transactionHash,
      from: transaction.from,
      token: decodedData.sourceToken,
      amount: decodedData.sourceAmount,
      chainId: decodedData.sourceChainId,
      targetChainId: decodedData.targetChainId,
      targetToken: decodedData.targetToken,
      targetAddress: decodedData.targetAddress,
      signatures: [],
      salt: '',
    };

    txData.salt = Web3.utils.keccak256(
      txData.transactionHash.toLocaleLowerCase(),
    );
    const payBySig = await createSignedPayment(
      txData.targetChainId,
      txData.targetAddress,
      destinationAmountToMachine,
      txData.targetToken,
      txData.salt,
      job,
    );

    return {
      ...txData,
      signatures: [payBySig.signatures, payBySig.signatures],
      hash: 'payBySig.hash',
    };
  } catch (error) {
    console.error('Error occured while decoding transaction', error);
  }
};

const createSignedPayment = async (
  chainId: string,
  address: string,
  amount: string,
  token: string,
  salt: string,
  job: any,
) => {
  const payBySig = produceSignatureWithdrawHash(
    chainId,
    token,
    address,
    amount,
    salt,
  );
  console.log('hash', payBySig.hash);
  const privateKey = process.env.PRIVATE_KEY as string;
  let provider = ethers.getDefaultProvider(job.data.sourceRpcURL);
  const wallet = new Wallet(privateKey, provider);
  let signature = await wallet.signMessage(payBySig.hash);
  signature = signature.replace(/^0x/, '');
  payBySig.signatures = [signature];
  return payBySig;
};

const produceSignatureWithdrawHash = (
  chainId: string,
  token: string,
  payee: string,
  amount: string,
  salt: string,
): any => {
  const hash = `{"chain_id":"${chainId}","payee":"${payee}","token":"${token}","amount":"${amount}","salt":"${salt}"}`;
  return {
    signatures: [],
    hash,
  };
};

export const getLogsFromTransactionReceipt = (job: any) => {
  try {
    let decodedData: any = {};
    job.returnvalue.transactionHash = job?.returnvalue?.hash;
    job.returnvalue.status = false;
    if (job?.returnvalue?.code == 0) {
      job.returnvalue.status = true;
    }
    let rawLogs = job?.returnvalue?.rawLog;
    var logs = JSON.parse(rawLogs);
    decodedData.sourceToken = filterLogsAndGetValue(logs, 'token');
    decodedData.sourceAmount = filterLogsAndGetValue(logs, 'amount');
    if (decodedData.sourceAmount) {
      decodedData.sourceAmount = decodedData.sourceAmount.replace('acudos', '');
    }
    decodedData.sourceChainId = CUDOS_CHAIN_ID;
    decodedData.targetChainId = filterLogsAndGetValue(logs, 'target_chain_id');
    decodedData.targetToken = filterLogsAndGetValue(logs, 'target_token');
    decodedData.targetAddress = filterLogsAndGetValue(logs, 'target_address');
    decodedData.from = filterLogsAndGetValue(logs, 'from');
    decodedData.swapBridgeAmount = filterLogsAndGetValue(
      logs,
      'swap_bridge_amount',
    );

    return decodedData;
  } catch (error) {
    console.error('Error occured while getting logs from transaction', error);
  }
};

export const filterLogsAndGetValue = (logs: any, key: string) => {
  if (logs?.length > 0) {
    let events = logs[0].events;
    for (const event of events) {
      if (event?.attributes.length > 0) {
        for (const attribute of event?.attributes) {
          if (attribute.key === key) {
            return attribute.value;
          }
        }
      }
    }
  }
};

const getDestinationAmount = async (data: any) => {
  console.log('data.bridgeAmount', data.swapBridgeAmount);
  return data.swapBridgeAmount;
};
