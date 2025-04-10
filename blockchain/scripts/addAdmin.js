const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const verificationContract = await hre.ethers.getContractAt(
    "PropertyVerification",
    "0x4c2323b4E8Eae4fc325776E555302B0874C23D1F"
  );

  // Add the specific address as admin
  const adminAddress = "0xDb3C66f3Efbb72A2079730bFe929adAE925a5182";
  const tx = await verificationContract.addAdmin(adminAddress);
  await tx.wait();

  console.log(`Admin added successfully! Address: ${adminAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 