
# Gelato Raas Account Abstraction with Safe

This starter helps to quick start developing on Gelato Raas with Safe account Abstraction

## Funding
You would need Sepolia test Eth. Please go to one of these faucets and grab some eth:

- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [pow Faucet](https://sepolia-faucet.pk910.de/)

Once you have Sepolia Eth you will have to bridge to your Gelato Rollup



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
| Safe Protocol Kit | [gelato-raas-protocol-kit](https://www.npmjs.com/package/gelato-raas-protocol-kit)|
| Safe AA Kit | [gelato-raas-account-abstraction-kit](https://www.npmjs.com/package/gelato-raas-account-abstraction-kit)|
| Safe Relay Kit | [gelato-raas-relay-kit](https://www.npmjs.com/package/gelato-raas-relay-kit)|

In the [Raas AA UI](https://github.com/gelatodigital/gelato-raas-aa) we showcase how to implement AA with web3Auth for social login, Safe as smart contract wallet and Gelato Relay for Gasless transactions.
A live demo can be seen here:
 [https://gelato-raas-aa.web.app/](https://gelato-raas-aa.web.app/)
 
Here we are going to show the how to send Gasless Transactions through a Safe sponsoring the gas with [1Balance](https://docs.gelato.network/developer-services/1balance) 

In both examples we are going to `increment()`the counter on this simple contract deployed on all Gelato Rollups at "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27"

### Code 

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

## Working with Safes

We have deployed and verified the the Safe contracts and also we forked the safe sdk to be able to test in OpTest. 
The forked safe-sdk is published under the package  **gelato-raas-protocol-kit@1.0.4**. The relay-kit and account.abstraction-kit will be published very soon.


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
We have deployed a SimpleCounter contract at "0xEEeBe2F778AA186e88dCf2FEb8f8231565769C27" where we are going to increment the counter through a safe transaciton.
Here the [code](./src/safe/increment-counter.ts#L35) 

```shell
yarn increment-counter
```

```shell
$ ts-node src/increment-counter.ts
TxHash:  0xce9271aba30a6e68a36f3ce75690ea63e2258d7d9a1d2bb69d58b10ae4fd70d7
✨  Done in 15.47s.
```
