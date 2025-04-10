const { ethers } = require("hardhat");

async function main() {
  const PropertyVerification = await ethers.getContractFactory("PropertyVerification");
  const verificationContract = await PropertyVerification.deploy();
  await verificationContract.waitForDeployment();

  console.log("PropertyVerification contract deployed at:", await verificationContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 