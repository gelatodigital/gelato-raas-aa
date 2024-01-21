import { deployments, getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";


// 0xA47789e8C1caC47Bd891e33C97cB3C6722037282
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  if (hre.network.name !== "hardhat") {
    console.log(
      `Deploying SimpleCounter to ${hre.network.name}. Hit ctrl + c to abort`
    );
  }


  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

const pln =  await deploy("PLN", {
    from: deployer,
    log: hre.network.name !== "hardhat",
    args:[deployer]
  }) ;


console.log("PLN deployed at: ", pln.address)

const trustedForwarder = "0xd8253782c45a12053594b9deB72d8e8aB2Fca54c"
const gasL =  await deploy("GaslessNFT", {
  from: deployer,
  log: hre.network.name !== "hardhat",
  args:[pln.address,trustedForwarder]
}) ;

console.log("Gas deployed at: ", gasL.address)



};
export default func;

func.tags = ["PLN"];
