import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  const PredictionLeague = await ethers.getContractFactory("PredictionLeague");
  
  const contract = await PredictionLeague.deploy(deployer.address);

  await contract.waitForDeployment();

  console.log("PredictionLeague deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

