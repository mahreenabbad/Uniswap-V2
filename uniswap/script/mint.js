require('dotenv').config();
const { ethers } = require('ethers');
const TokenAJson = require('../artifacts/contracts/TokenA.sol/MyTokenA.json');
const TokenBJson = require('../artifacts/contracts/TokenB.sol/MyTokenB.json');
const WETHJson = require('../artifacts/contracts/WETH.sol/WETH.json')


// ✅ Set these environment variables in a `.env` file
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// ✅ Use the TokenA ABI from the contract JSON
const contractTA = "0x78cefc72DDB436a254F3b540f4D0663f84bF651d";
const contractA = new ethers.Contract(contractTA, TokenAJson.abi, signer);

// ✅ Use the TokenA ABI from the contract JSON
const contractTB = "0xaB90f7dF2EA8e6015d5204737F5187f135682a6C";
const contractB = new ethers.Contract(contractTB, TokenBJson.abi, signer);

// ✅ Use the ABI from the contract JSON
const routerContAddress = "0xa20d8Cba1c7C387F5cEed869F1dC5814dBe2dCd4";
const amountToApprove = ethers.parseUnits("1000", 18); // 100 tokens//ethers.constants.MaxUint256

//WETH instance
const WETHContAddress ="0x1Be4730A3ceC60114305dA48576F0F23c0bAE2AB"
const WETH = new ethers.Contract(WETHContAddress, WETHJson.abi, signer);

const recipient = "0x13A538AEa48B39b17915eCb001f5330131c36a1A";

async function main() {
  // const amount = ethers.parseUnits("1000", 18); // 1000 tokens, 18 decimals

  // console.log(`Sending TokenA mint transaction...`);
  // const tx = await contractA.mint(recipient, amount);
  // await tx.wait();
  // console.log(`✅ Minted 1000 tokenA to ${recipient}`);

  // console.log(`Sending TokenB mint transaction...`);
  // const tx1 = await contractB.mint(recipient, amount);
  // await tx1.wait();
  // console.log(`✅ Minted 1000 tokenB to ${recipient}`);

  //Approve the router

// const tx1 =await contractA.approve(routerContAddress, amountToApprove);
// console.log("tokenA approval TX",tx1)
// const tx2 =await contractB.approve(routerContAddress, amountToApprove);
// console.log("tokenB approval TX",tx2)

//deposit weth
// const tx = await WETH.deposit({ value: ethers.parseEther("0.05") });
// console.log(" deposit tx",tx)

  
}

main().catch((err) => {
  console.error("❌ Minting failed:", err);
});
