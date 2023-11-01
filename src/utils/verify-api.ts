import { ethers } from "ethers";

import axios, { AxiosError, AxiosResponse } from "axios";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

let RPC_URL = "https://rpc.zkatana.gelato.digital";

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(process.env.PK!, provider);

async function verify() {
  let contractaddress = "0x00D76203b92ec96bB46d252e3A30660D6a9bD319";
  axios
    .post("https://zkatana.blockscout.com/api?module=contract&action=verify", {
      addressHash: contractaddress,
      compilerVersion: "v0.8.18+commit.87f61d96",
      contractSourceCode: `// SPDX-License-Identifier: MIT
      pragma solidity 0.8.18;
      
      contract SimpleCounterUser {
          uint256 public counter;
          mapping(address=> uint) public incrementsByUser;
          event IncrementCounter(uint256 newCounterValue, address msgSender);
      
          function increment() external {
              counter++;
              incrementsByUser[msg.sender]++;
              emit IncrementCounter(counter, msg.sender);
          }
      }`,
      name: "SimpleCounterUser",
      optimization: true,
      runs:200

    })
    .then((response) => console.log(response.data))
    .catch((err) => console.log(err));
}
verify();
