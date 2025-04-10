const { ethers } = require("hardhat");

async function main() {
  const PropertyContract = await ethers.getContractFactory("PropertyContract");
  const contract = await PropertyContract.deploy();
  await contract.waitForDeployment();

  console.log("Contract deployed at:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
