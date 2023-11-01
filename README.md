
# Gelato Raas Starter-Kit

This starter helps to quick start developing on OpTest
Please visit the public [website](https://raas.gelato.network/ryarnollups/details/public/optestnet) and the [Block explorer](https://blockscout.op-testnet.gelato.digital)

## Funding
You would need Sepolia test Eth. Please go to one of these faucets and grab some eth:

- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [pow Faucet](https://sepolia-faucet.pk910.de/)

Once you have Sepolia Eth you will have to bridge to OpTest eth. Please login in on Sepolia chain and brigde the required amount, it will take 8-10 minuts to confirm.



## Getting Started

1. Install project dependencies:
```
yarn install
```
in our package.json we have already included gelato-raasprotocol-kit
the 
2. Create a `.env` file with your private config:
```
cp .env.example .env
```
You will need to input your Private Key `PK` and `GELATO_RELAY_API_KEY` for sponsored transactions, you an get it at [https://relay.gelato.network](https://relay.gelato.network)



## Account Abstraction (AA)

As part of the Gelato Raas AA offerings, we have deployed a custom safe-sdk creating following packages

| Package| SDK |
| --- | ----------- |
| Safe Protocol Kit | gelato-raas-protocol-kit|
| Safe AA Kit | gelato-raa-account-abstraction-kit|
| Safe Relay Kit | gelato-raas-relay-kit|

 
Here we are going to show the two different ways to send Gasless Transactions through a Safe, either sponsoring the gas with [1Balance](https://docs.gelato.network/developer-services/1balance) or paying with the Safe balance (SyncFee) 

In both examples we are going to `increment()`the counter on this simple contract deployed on OpTest [https://blockscout.op-testnet.gelato.digital/address/0xA47789e8C1caC47Bd891e33C97cB3C6722037282](https://blockscout.op-testnet.gelato.digital/address/0xA47789e8C1caC47Bd891e33C97cB3C6722037282)

### Using 1Balance

```typescript
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
```
**Output**
```shell
/Users/javiermac/Documents/GELATO/20-RAAS/gelato-raas-starter/src/aa-safe-gasless
{ predictedSafeAddress: '0xf35EAc5DA7d808264a9c7B1C19E2946201320522' }
{ isSafeDeployed: true }
```

### Using  SyncFee  
Remember to fund your Safe as the gas fees will be deducted from your safe balance

```typescript

  const gasLimit = "10000000";
  
  const safeAccountAbstraction = new AccountAbstraction(signer);
  const sdkConfig: AccountAbstractionConfig = {
    relayPack,
  };
  await safeAccountAbstraction.init(sdkConfig);

  const txConfig = {
    TO: targetAddress,
    DATA: counterContract.interface.encodeFunctionData("increment", []),,
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
```

  **Output**
  ```shell
$ ts-node src/aa-safe-gasless/aaSyncFee.ts
/Users/javiermac/Documents/GELATO/20-RAAS/gelato-raas-starter/src/aa-safe-gasless
{ predictedSafeAddress: '0xf35EAc5DA7d808264a9c7B1C19E2946201320522' }
{ isSafeDeployed: true }
https://relay.gelato.digital/tasks/status/0xf5ec5234b97a42a3fa32a1593dc34e44130b6801d9fff9ad1246f65cda0f8ecc 
✨  Done in 24.41s.
```

## Working with Safes

We have deployed and verified the the Safe contracts and also we forked the safe sdk to be able to test in OpTest. 
The forked safe-sdk is published under the package  **gelato-raas-protocol-kit@1.3.1**. The relay-kit and account.abstraction-kit will be published very soon.



### Create a Safe
Code can be seen [here](./src/safe/create-safe.ts#L19) 

```shell
yarn create-safe
```

```shell
yarn run v1.22.19
$ ts-node src/create-safe.ts
Network:  { chainId: 42069, name: 'unknown' }
Safe created with address:  0xf35EAc5DA7d808264a9c7B1C19E2946201320522
✨  Done in 13.27s.
```

### Increment counter
We have deployed a [SimpleCounter](https://blockscout.op-testnet.gelato.digital/address/0xA47789e8C1caC47Bd891e33C97cB3C6722037282) contract  where we are going to increment the counter through a safe transaciton.
Here the [code](./src/safe/increment-counter.ts#L35) 

```shell
yarn increment-counter
```

```shell
$ ts-node src/increment-counter.ts
TxHash:  0xce9271aba30a6e68a36f3ce75690ea63e2258d7d9a1d2bb69d58b10ae4fd70d7
✨  Done in 15.47s.
```
