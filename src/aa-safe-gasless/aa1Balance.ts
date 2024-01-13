import { ethers } from "ethers";
import { GelatoRelayPack } from "gelato-raas-relay-kit";
import {
  MetaTransactionData,
  MetaTransactionOptions,
  OperationType,
} from "@safe-global/safe-core-sdk-types";

import AccountAbstraction, {
  AccountAbstractionConfig,
} from "gelato-raas-account-abstraction-kit";

import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

import ContractInfo from "./ABI.json";

let RPC_URL =  "https://rpc.unreal.gelato.digital"
// ZKATANA RPC_URL = "https://rpc.zkatana.gelato.digital";
// OP Testnet RPC_URL = "https://rpc.op-testnet.gelato.digital";


const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

const signer = new ethers.Wallet(process.env.PK!, provider);

const GELATO_RELAY_API_KEY = process.env.GELATO_RELAY_API_KEY;

const relayPack = new GelatoRelayPack(GELATO_RELAY_API_KEY);

const targetAddress = "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27"

const counterContract = new ethers.Contract(
  targetAddress,
  ContractInfo.abi,
  signer
);

async function relayTransaction() {

  const gasLimit = "10000000";
  
  const safeAccountAbstraction = new AccountAbstraction(signer);
  const sdkConfig: AccountAbstractionConfig = {
    relayPack,
  };
  await safeAccountAbstraction.init(sdkConfig);

  // Create a transaction object
  const txConfig = {
    TO: targetAddress,
    DATA:counterContract.interface.encodeFunctionData("increment", []),
    // Options:
    GAS_LIMIT: gasLimit,
    VALUE:"0"
  };

  const predictedSafeAddress = await safeAccountAbstraction.getSafeAddress();
  console.log({ predictedSafeAddress });

  const isSafeDeployed = await safeAccountAbstraction.isSafeDeployed();
  console.log({ isSafeDeployed });

  const safeTransactions: MetaTransactionData[] = [
    {
      to: txConfig.TO,
      data: txConfig.DATA,
      value: txConfig.VALUE,
      operation: OperationType.Call,
    },
  ];
  const options: MetaTransactionOptions = {
    gasLimit: txConfig.GAS_LIMIT,
    isSponsored: true,
  };

  const response = await safeAccountAbstraction.relayTransaction(
    safeTransactions,
    options
  );
  console.log(`https://relay.gelato.digital/tasks/status/${response} `);
}
relayTransaction();
