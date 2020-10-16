import BigNumber from 'bignumber.js';
import BN = require('bn.js');
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import {WAD} from './constants';
import {Wallet, ContractTransaction} from 'ethers';
import {BuidlerRuntimeEnvironment} from '@nomiclabs/buidler/types';
import path from 'path';
import fs from 'fs';

export const toWad = (value: string | number) => new BigNumber(value).times(WAD).toFixed();

export const bnToBigNumber = (amount: BN): BigNumber => new BigNumber(<any>amount);
export const stringToBigNumber = (amount: string): BigNumber => new BigNumber(amount);

export const getDb = () => low(new FileSync('./deployed-contracts.json'));

export let BRE: BuidlerRuntimeEnvironment = {} as BuidlerRuntimeEnvironment;
export const setBRE = (_BRE: BuidlerRuntimeEnvironment) => {
  BRE = _BRE;
};

export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const createRandomAddress = () => Wallet.createRandom().address;

export const evmSnapshot = async () => await BRE.ethereum.send('evm_snapshot', []);

export const evmRevert = async (id: string) => BRE.ethereum.send('evm_revert', [id]);

export const timeLatest = async () => {
  const block = await BRE.ethers.provider.getBlock('latest');
  return new BigNumber(block.timestamp);
};

export const advanceBlock = async (timestamp: number) =>
  await BRE.ethers.provider.send('evm_mine', [timestamp]);

export const increaseTime = async (secondsToIncrease: number) => {
  await BRE.ethers.provider.send('evm_increaseTime', [secondsToIncrease]);
  await BRE.ethers.provider.send('evm_mine', []);
};

export const waitForTx = async (tx: ContractTransaction) => await tx.wait();

export const filterMapBy = (raw: {[key: string]: any}, fn: (key: string) => boolean) =>
  Object.keys(raw)
    .filter(fn)
    .reduce<{[key: string]: any}>((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {});
