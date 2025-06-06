const { keccak256 } = require("ethers");
// const fs = require("fs");
//get hex for UniswapV2Library PairFor() function
const pairArtifact = require("./artifacts/contracts/UniswapV2Factory.sol/UniswapV2Pair.json");

async function main() {
  // Load the correct artifact for UniswapV2Pair

  const bytecode = pairArtifact.bytecode;
  const hash = keccak256(bytecode);

  console.log("UniswapV2Pair INIT CODE HASH:", hash);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
