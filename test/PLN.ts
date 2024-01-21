


import { ethers, deployments, network } from "hardhat";

import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import hre from "hardhat";
import { GaslessNFT, PLN } from "../typechain";
import { expect } from "chai";
import { doSign} from "../utils/sign"



describe("ClassicModelETH", function () {

  let pln: PLN;
  let plnAddress: string;

  let gasl: GaslessNFT;
  let gaslAddress: string;

  let multicall: Contract;
  let user1:SignerWithAddress;
  let user2:SignerWithAddress;
  let user3:SignerWithAddress;
  // Set up all contracts
  before(async () => {
    
    [user1,user2,user3] = await hre.ethers.getSigners()


    /// Deploying ETH
    await deployments.fixture()

    plnAddress = (await deployments.get("PLN")).address;
    pln = (await ethers.getContractAt(
      "PLN",
      plnAddress
    )) as PLN;


    gaslAddress = (await deployments.get("GaslessNFT")).address;
    gasl = (await ethers.getContractAt(
      "GaslessNFT",
      gaslAddress
    )) as GaslessNFT;

    //  const multicallAbi =["function aggregate(tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes[] returnData)"]
    //  multicall = await  new Contract("0xcA11bde05977b3631167028862bE2a173976CA11",multicallAbi,deployer)
 
  });


  it("PLN should accept permit", async () => {

    expect(await pln.balanceOf(user1.address)).eq(0)
    await pln.mint(user1.address,1000);
    expect(await pln.balanceOf(user1.address)).eq(1000)


    
    //await expect(pln.transferFrom(user1.address,user2.address,50)).to.be.revertedWithCustomError

    const deadline = Math.floor(Date.now() / 1000) + 60 * 5;

    const chainId = await user1.getChainId();

    const sig = await doSign(user1, pln, 50, user1.address,user2.address, deadline,chainId );
    await expect(pln.connect(user2).transferFrom(user1.address,user2.address,50)).rejectedWith('ERC20InsufficientAllowance("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 0, 50)')
    
    const { v, r, s } = sig;
    // const { data } = await nft!.mint.populateTransaction(signer.address, amount, deadline, v, r, s);

    await pln.permit(user1.address,user2.address,50,deadline,v,r,s)

    const bal = await pln.allowance(user1.address,user2.address);
 
    await pln.connect(user2).transferFrom(user1.address,user2.address,50)

    expect(await pln.balanceOf(user1.address)).eq(950)
    expect(await pln.balanceOf(user2.address)).eq(50)

  });

  it.only("should accept permit", async () => {

    expect(await pln.balanceOf(user1.address)).eq(0)
    await pln.mint(user1.address,1000);
    expect(await pln.balanceOf(user1.address)).eq(1000)


    
    //await expect(pln.transferFrom(user1.address,user2.address,50)).to.be.revertedWithCustomError

    const deadline = Math.floor(Date.now() / 1000) + 60 * 5;

    const chainId = await user1.getChainId();

    console.log(100)
    const sig = await doSign(user1, pln, 50, user1.address,gaslAddress, deadline,chainId );
    //await expect(pln.connect(user2).transferFrom(user1.address,user2.address,50)).rejectedWith('ERC20InsufficientAllowance("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 0, 50)')
    console.log(103)
    const { v, r, s } = sig;
    // const { data } = await nft!.mint.populateTransaction(signer.address, amount, deadline, v, r, s);



    await gasl.trade(gaslAddress,50,deadline,v,r,s)
    console.log(108)
    //const bal = await pln.allowance(user1.address,user2.address);
 
   // await pln.connect(user2).transferFrom(user1.address,user2.address,50)

    //expect(await pln.balanceOf(user1.address)).eq(950)
    expect(await pln.balanceOf(gaslAddress)).eq(50)

  });

});
