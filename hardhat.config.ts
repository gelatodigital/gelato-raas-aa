import { HardhatUserConfig } from "hardhat/config";

// PLUGINS
// import "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";

// Process Env Variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const PK = process.env.PK;
const ALCHEMY_ID = process.env.ALCHEMY_ID;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// HardhatUserConfig bug
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config: HardhatUserConfig = {
  // web3 functions
  // w3f: {
  //   rootDir: "./web3-functions",
  //   debug: false,
  //   networks: ["hardhat", "mumbai"], //(multiChainProvider) injects provider for these networks
  // },
  // hardhat-deploy
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  defaultNetwork: "opTest",

  networks: {
    hardhat: {
      forking: {
        url: `https://rpc.zkatana.gelato.digital`,
        blockNumber: 92,
      },
    },

    zKatana: {
      accounts: PK ? [PK] : [],
      chainId: 1261120,
      url: `https://rpc.zkatana.gelato.digital`,
    },
    opTest: {
      accounts: PK ? [PK] : [],
      chainId: 42069,
      url: `https://rpc.op-testnet.gelato.digital`,
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.18",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },

  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },

  // hardhat-deploy
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY ? ETHERSCAN_API_KEY : "",
    },
  },
};

export default config;
