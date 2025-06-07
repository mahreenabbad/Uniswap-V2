require("dotenv").config();
const { ethers } = require("ethers");
const routerAbi = require("../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json");
const TokenAJson = require("../artifacts/contracts/TokenA.sol/MyTokenA.json");
const TokenBJson = require("../artifacts/contracts/TokenB.sol/MyTokenB.json");
const FactoryJson = require("../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json");
//interact main functions
//create connection 
// ✅ Set these environment variables in a `.env` file
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`
);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const WETHContAddress = "0x1Be4730A3ceC60114305dA48576F0F23c0bAE2AB";

// TokenA and TokenB contract addresses
// ✅ Use the TokenA ABI from the contract JSON
const TokenA = "0x78cefc72DDB436a254F3b540f4D0663f84bF651d";
const contractA = new ethers.Contract(TokenA, TokenAJson.abi, signer);

// ✅ Use the TokenA ABI from the contract JSON
const TokenB = "0xaB90f7dF2EA8e6015d5204737F5187f135682a6C";
const contractB = new ethers.Contract(TokenB, TokenBJson.abi, signer);
// ✅ Use the ABI from the contract JSON
const routerContAddress = "0xa20d8Cba1c7C387F5cEed869F1dC5814dBe2dCd4";
const router = new ethers.Contract(routerContAddress, routerAbi.abi, signer);
//Factory
const factoryAddress = "0xbeca4a2b65D2E6C1164B13D15f6E27baC3be50fa";
const factory = new ethers.Contract(factoryAddress, FactoryJson.abi, signer);

/////////////
//Add liquidity
const amountADesired = ethers.parseUnits("200", 18); // 100 tokens
const amountBDesired = ethers.parseUnits("600", 18); // 200 tokens
const amountAMin = ethers.parseUnits("180", 18); // minimum acceptable
const amountBMin = ethers.parseUnits("580", 18);
// const to = "0x13A538AEa48B39b17915eCb001f5330131c36a1A";
// const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 10 min from now

///add liquidity
// async function main() {
//       try {
//               // Check balances first
//         const balanceA = await contractA.balanceOf(signer.address);
//         const balanceB = await contractB.balanceOf(signer.address);

//         console.log(`TokenA Balance: ${ethers.formatUnits(balanceA, 18)}`);
//         console.log(`TokenB Balance: ${ethers.formatUnits(balanceB, 18)}`);

//         if (balanceA < amountADesired || balanceB < amountBDesired) {
//             throw new Error("Insufficient token balance");
//         }

//         const allowanceA = await contractA.allowance(signer.address, routerContAddress);
//       const allowanceB = await contractB.allowance(signer.address, routerContAddress);
//       console.log("Allowance TokenA:", ethers.formatUnits(allowanceA, 18));
//       console.log("Allowance TokenB:", ethers.formatUnits(allowanceB, 18));

//          // 2) Check & submit approvals if needed
// //     const allowanceA = await contractA.allowance(signer.address, routerContAddress);
// //     if (allowanceA<(amountADesired)) {
// //       await (await contractA.approve(routerContAddress, amountADesired)).wait();
// //     }
// //     const allowanceB = await contractB.allowance(signer.address, routerContAddress);
// //     if (allowanceB<(amountBDesired)) {
// //       await (await contractB.approve(routerContAddress, amountBDesired)).wait();
// //     }

//       const pairAddress = await factory.getPair(TokenA, TokenB);
//       console.log("Pair address:", pairAddress);
//             const tx = await router.addLiquidity(
//               TokenA,
//               TokenB,
//               amountADesired,
//               amountBDesired,
//               amountAMin,
//               amountBMin,
//               to,
//               deadline
//               );

//             console.log("Transaction hash:", tx.hash);

//             // Wait for confirmation (optional)
//             const receipt = await tx.wait();
//             console.log("receipt",receipt)
//       } catch (error) {
//             console.error("Error:", error);
//         if (error.info && error.info.error) {
//             console.error("Revert reason:", error.info.error.message);
//       }
// // console.log("Liquidity added! Gas used:", receipt.gasUsed.toString());

// }
// }
// main()
////////////////////////////
//// Create Pair
// async function main() {
//   // 1. Optional: Check that no pair already exists
//   const existing = await factory.getPair(TokenA, TokenB);
//   if (existing !== ethers.ZeroAddress) {
//     console.log('Pair already exists at:', existing);
//     return;
//   }

//   // 2. Call createPair
//   const tx = await factory.createPair(TokenA, TokenB);
//   console.log('createPair tx hash:', tx.hash);

//   // 3. Wait for mining
//   const receipt = await tx.wait();
//   console.log('createPair confirmed in block:', receipt.blockNumber);

// }

// main()
//   .catch(err => {
//     console.error('Error:', err);
//     process.exit(1);
//   });
////////////////////
//swapExactTokensForTokens

// async function swapExactTokensForTokens(){
// try {

//       const amountIn = ethers.parseUnits("5", 18); // 1 tokenIn
//       const amountOutMin = ethers.parseUnits("0.2", 18); // Expect at least 0.9 tokenOut
//       const path = [ TokenB,TokenA];
//       const to = "0xda0240Df4371aB5a26ea9De6E49dADB1e7B3c1Ad";
//       const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
//       const tx = await router.swapExactTokensForTokens(
//         amountIn,
//         amountOutMin,
//         path,
//         to,
//         deadline
//       );

//       console.log("TX Hash:", tx.hash);
//       await tx.wait();
//       console.log("Swap complete");
// } catch (error) {
//   console.error("Error:", error);

// }
// }
// swapExactTokensForTokens()
/////////////////

//swapTokensForExactTokens()

// async function swapTokensForExactTokens(){
//       try {
//             const amountOut = ethers.parseUnits("10", 18); // Want exactly 10 tokenOut
//             const path = [TokenA, TokenB];
//             const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
//             const to = "0xda0240Df4371aB5a26ea9De6E49dADB1e7B3c1Ad"
//            const amountsIn = await router.getAmountsIn(amountOut, path);
//             // console.log("amountIn", amountsIn);

//             const amountInMax = (amountsIn[0] * 105n) / 100n;
//             // console.log("amountInMax", amountInMax);

//             // 3. Execute the swap
//             const tx = await router.swapTokensForExactTokens(
//             amountOut,
//             amountInMax,
//             path,
//             to,
//             deadline
//             );
//             console.log("Tx Hash:", tx.hash);
//             await tx.wait();
//             console.log("Swap completed");

//       } catch (error) {
//            console.error("Error:", error);
//       }
// }
// swapTokensForExactTokens()
///////////////////////////
//
//addLiquidityETH()
// async function addLiquidityETH(){
//       try {
//             const amountTokenDesired = ethers.parseUnits("100", 18);
//             const amountTokenMin = ethers.parseUnits("90", 18);
//             const amountETHMin = ethers.parseEther("0.035");
//             const amountETH = ethers.parseEther("0.04");
//              const to = "0x13A538AEa48B39b17915eCb001f5330131c36a1A";

//  const tx = await router.addLiquidityETH(
//   TokenA,
//   amountTokenDesired,
//   amountTokenMin,
//   amountETHMin,
//   to,
//   Math.floor(Date.now() / 1000) + 60 * 10, // 10 min deadline
//   { value: amountETH } // Send ETH with the tx
// );

// const receipt = await tx.wait();
// console.log("Liquidity added:", receipt);

//       } catch (error) {
//      console.error("Error:", error);

//       }
// }
// addLiquidityETH()
///////////////////////////////
//swapExactETHForTokens

// async function swapExactETHForTokens() {
//       try {
// // inputs
// const amountOutMin = ethers.parseUnits("10", 18); // Accept at least 50 tokens
// const path = [WETHContAddress, TokenA]; // From ETH (WETH) to Token
// const to = "0x13A538AEa48B39b17915eCb001f5330131c36a1A"; // your wallet
// const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 mins from now
// const amountInETH = ethers.parseEther("0.02"); // sending exactly 1 ETH

// // call the function with `value` attached
// const tx = await router.swapExactETHForTokens(
//   amountOutMin,
//   path,
//   to,
//   deadline,
//   { value: amountInETH } // this is how much ETH you're sending
// );

//  await tx.wait();
// console.log("Swap complete:", tx.hash);

//       } catch (error) {
//           console.error("Error:", error);

//       }
// }
// swapExactETHForTokens()
////////////////////////////
//swapTokensForExactETH
// async function swapTokensForExactETH() {
//       try {
//        const amountOutETH = ethers.parseEther("0.015"); // want exactly 0.5 ETH
//       const path = [ TokenA,WETHContAddress]; // From ETH (WETH) to Token
//       const to = "0x13A538AEa48B39b17915eCb001f5330131c36a1A"; // your wallet
//       // Get estimated token input required
//      const amountsIn = await router.getAmountsIn(amountOutETH, path);
//       //  console.log("amountin",amountsIn)
//      const amountInMax = (amountsIn[0] * 105n) / 100n; // Add 5% slippage
//       // console.log('amountInMax',amountInMax)
//       const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
//   // 2️⃣ Swap
//  const tx = await router.swapTokensForExactETH(
//   amountOutETH,
//   amountInMax,
//   path,
//   to,
//   deadline
// );

//  await tx.wait();
// console.log("Swap successful:", tx.hash);

//       } catch (error) {
//          console.error("Error:", error);

//       }
// }
// swapTokensForExactETH()
//////////////////////////////////////////
const lpTokenAbi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];
const lpCAforETHpair = "0x9031fe229252C5Dd657C9D2e72b67b67Eb17d621";
const lpCAforERC20Pairs = "0x7663fC613b60876E047C6C6c17614c0f0Fa81672"; // From transaction logs (pair)

const lpTokenERC20 = new ethers.Contract(lpCAforERC20Pairs, lpTokenAbi, signer);

const lpTokenETH = new ethers.Contract(lpCAforETHpair, lpTokenAbi, signer);

//remove liquidity of erc20 pairs

async function removeLiquidity() {
  try {
    // Step 1: Approve Router to spend LP tokens

    const liquidity = ethers.parseUnits("8", 18); // Amount of LP tokens to burn
    await lpTokenERC20.approve(router, liquidity);
    const amountAMin = ethers.parseUnits("2", 18); // Minimum amount of tokenA
    const amountBMin = ethers.parseUnits("6", 18); // Minimum amount of tokenB
    const to = "0x13A538AEa48B39b17915eCb001f5330131c36a1A";
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
    // Step 2: Call removeLiquidity
    const tx = await router.removeLiquidity(
      TokenA,
      TokenB,
      liquidity,
      amountAMin,
      amountBMin,
      to,
      deadline
    );
    await tx.wait();
    console.log("Liquidity removed:", tx.hash);
  } catch (error) {
    console.error("Error:", error);
  }
}
removeLiquidity();
