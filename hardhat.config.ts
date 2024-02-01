import { HardhatUserConfig } from "hardhat/config";

// PLUGINS
// import "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";


// Process Env Variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const PK = process.env.PK;


// HardhatUserConfig bug
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config: HardhatUserConfig = {

  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  defaultNetwork: "liskSepolia",

  networks: {
    hardhat: {
      forking: {
        url: "https://rpc.sepolia-api.lisk.com",
      },
    },
    unreal: {
      accounts: PK ? [PK] : [],
      chainId: 18231,
      url: `https://rpc.unreal.gelato.digital`,
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
    gelopcelestiatestnet: {
      accounts: PK ? [PK] : [],
      chainId: 123420111,
      url: "https://rpc.op-celestia-testnet.gelato.digital",
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.23",
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
  etherscan: {
    apiKey: {
      unreal: 'your API key'
    },
    customChains: [
      {
        network: "unreal",
        chainId: 18231,
        urls: {
          apiURL: "https://unreal.blockscout.com/api",
          browserURL: "https://unreal.blockscout.com"
        }
      }
    ]
  },
};

export default config;
