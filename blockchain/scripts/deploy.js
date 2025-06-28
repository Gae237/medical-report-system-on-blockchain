const hre = require("hardhat")

async function main() {
  console.log("Deploying MedicalReportSystem contract...")

  const MedicalReportSystem = await hre.ethers.getContractFactory("MedicalReportSystem")
  const medicalReportSystem = await MedicalReportSystem.deploy()

  await medicalReportSystem.waitForDeployment()

  const contractAddress = await medicalReportSystem.getAddress()
  console.log("MedicalReportSystem deployed to:", contractAddress)

  // Save contract address and ABI for frontend
  const fs = require("fs")
  const contractData = {
    address: contractAddress,
    abi: JSON.parse(medicalReportSystem.interface.formatJson()),
  }

  fs.writeFileSync("../client/src/contracts/MedicalReportSystem.json", JSON.stringify(contractData, null, 2))
  console.log("Contract data saved to client/src/contracts/MedicalReportSystem.json")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
