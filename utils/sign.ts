
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract, Signature, providers , utils} from 'ethers'
import hre from "hardhat";

export const frontend = async  () => {

    
    // const request: CallWithSyncFeeRequest = {
    //   chainId: chainId.toString(),
    //   target: nft!.target.toString(),
    //   feeToken: token!.target.toString(),
    //   isRelayContext: true,
    //   data: data
    // };
    
}


export const doSign = async (signer: providers.JsonRpcSigner | SignerWithAddress, token: Contract, value: any,owner:string, spender: string, deadline: number, chainId: number): Promise<Signature | null> => {
    const salt = utils.solidityPack(['uint256'], [chainId]);
    console.log(salt)
    console.log(await token.name())
    console.log(await signer.getAddress())
    const domain = {
      name: await token.name(),
      version: '1',
      chainId:chainId,
      verifyingContract: token.address
    };
  
    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
      ]
    };
  


    const data = {
      owner: owner,
      spender: spender,
      value: value,
      nonce: await token.nonces(owner),
      deadline: deadline
    };
    const sig = await signer._signTypedData(domain, types, data);

    const recoveredAddress = utils.verifyTypedData(
      domain,
      types,
      data,
      sig)

      console.log(recoveredAddress)
      console.log(owner)
     return utils.splitSignature(sig);
   // try {

      
    //     const recoveredAddress = ethers.utils.verifyTypedData(
    //     domain,
    //     types,
    //     result.verificationResult,
    //     result.signature
    //   )
    //   return ethers.utils.splitSignature(sig);


    // }
    // catch (e) {
    //   return null
    // }
  };
  