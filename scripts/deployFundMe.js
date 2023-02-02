const { ethers, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const DECIMALS = "8";
const INITIAL_PRICE = "200000000000"; // 2000

async function main() {
  await deployFundMe();
}

async function deployFundMe() {
  const chainId = network.config.chainId;
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  let mockPriceFeedAddress;
  if (chainId == 31337) {
    const mockPriceFeedFactory = await ethers.getContractFactory(
      "MockV3Aggregator"
    );
    mockPriceFeed = await mockPriceFeedFactory
      .connect(deployer)
      .deploy(DECIMALS, INITIAL_PRICE);
    await mockPriceFeed.deployed();
    mockPriceFeedAddress = mockPriceFeed.address;
  } else {
    mockPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  console.log("Deploying, please wait...")
  const fundMeFacotry = await ethers.getContractFactory("FundMe");
  const fundMe = await fundMeFacotry
    .connect(deployer)
    .deploy(mockPriceFeedAddress);
  await fundMe.deployed();
  console.log(`Deployed FundMe to ${fundMe.address}`);
  return fundMe;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports = {
  deployFundMe,
  INITIAL_PRICE,
};
