import { ethers } from "ethers";
// import { GelatoRelayPack } from "gelato-relay-kit";
import Safe, {
  EthersAdapter,
  getSafeContract,
} from "gelato-raas-protocol-kit";
import {
  MetaTransactionData,
  OperationType,
} from "@safe-global/safe-core-sdk-types";

import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

import ContractInfo from "../../deployments/opTest/SimpleCounter.json";

let RPC_URL = "https://rpc.op-testnet.gelato.digital";

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(process.env.PK!, provider);

let safeAddress = "0xf35EAc5DA7d808264a9c7B1C19E2946201320522";

const targetAddress = ContractInfo.address;

const nftContract = new ethers.Contract(
  targetAddress,
  ContractInfo.abi,
  signer
);



async function incrementCounter() {


  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });


  const safeSDK = await Safe.create({
    ethAdapter,
    safeAddress,
  });

  const safeTransactionData: MetaTransactionData = {
    to: targetAddress,
    data: nftContract.interface.encodeFunctionData("increment", []),
    value: "0",
    operation: OperationType.Call,
  };


  const standardizedSafeTx = await safeSDK.createTransaction({
    safeTransactionData,
  });



  const safeSingletonContract = await getSafeContract({
    ethAdapter: ethAdapter,
    safeVersion: await safeSDK.getContractVersion(),
  });

  const signedSafeTx = await safeSDK.signTransaction(standardizedSafeTx);

  const encodedTx = safeSingletonContract.encode("execTransaction", [
    signedSafeTx.data.to,
    signedSafeTx.data.value,
    signedSafeTx.data.data,
    signedSafeTx.data.operation,
    signedSafeTx.data.safeTxGas,
    signedSafeTx.data.baseGas,
    signedSafeTx.data.gasPrice,
    signedSafeTx.data.gasToken,
    signedSafeTx.data.refundReceiver,
    signedSafeTx.encodedSignatures(),
  ]);

  let tx = await signer.sendTransaction({
    value: 0,
    to: safeAddress,
    data: encodedTx,
  });

  await tx.wait();

  console.log('TxHash: ',tx.hash)

}
incrementCounter();
