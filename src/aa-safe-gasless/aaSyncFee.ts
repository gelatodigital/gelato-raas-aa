import { ethers } from "ethers";
import { GelatoRelayPack, RelayPack } from "gelato-raas-relay-kit";
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

console.log(__dirname);

import ContractInfo from "./ABI.json";

let RPC_URL ="https://rpc.zKatana.gelato.digital"//"https://rpc.op-testnet.gelato.digital";// "https://rpc.unreal.gelato.digital"//
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(process.env.PK!, provider);


const relayPack = new GelatoRelayPack();

const targetAddress = "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27";

const nftContract = new ethers.Contract(
  targetAddress,
  ContractInfo.abi,
  signer
);

async function relayTransaction() {

  const gasLimit = "1000000000";


  const safeTransactionData: MetaTransactionData = {
    to: targetAddress,
    data: nftContract.interface.encodeFunctionData("increment", []),
    value: "0",
    operation: OperationType.Call,
  };

  const safeAccountAbstraction = new AccountAbstraction(signer);
  const sdkConfig: AccountAbstractionConfig = {
    relayPack,
  };
  await safeAccountAbstraction.init(sdkConfig);

  const txConfig = {
    TO: targetAddress,
    DATA: safeTransactionData.data,
    VALUE: "0",
    // Options:
    GAS_LIMIT: gasLimit,
    GAS_TOKEN: ethers.constants.AddressZero,
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
    gasToken: txConfig.GAS_TOKEN,
    isSponsored: false,
  };

  const response = await safeAccountAbstraction.relayTransaction(
    safeTransactions,
    options
  );
  console.log(`https://relay.gelato.digital/tasks/status/${response} `);
}
relayTransaction();
