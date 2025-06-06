import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("UniswapV2Deployment", (m) => {
  const weth = m.contract("WETH"); // Use your WETH contract path

  const factory = m.contract("UniswapV2Factory", ["0xda0240Df4371aB5a26ea9De6E49dADB1e7B3c1Ad"]); // feeToSetter

  const router = m.contract("UniswapV2Router02", [
    factory,
    weth,
  ]);

  return { weth, factory, router };
});


//lp contract for ethpair 0x9031fe229252C5Dd657C9D2e72b67b67Eb17d621
// lp contract for erc20 pairs 0x7663fC613b60876E047C6C6c17614c0f0Fa81672

// UniswapV2Deployment#UniswapV2Factory - 0xbeca4a2b65D2E6C1164B13D15f6E27baC3be50fa
// UniswapV2Deployment#WETH - 0x1Be4730A3ceC60114305dA48576F0F23c0bAE2AB
// UniswapV2Deployment#UniswapV2Router02 - 0xa20d8Cba1c7C387F5cEed869F1dC5814dBe2dCd4

/////////////
// UniswapV2Deployment#UniswapV2Factory - 0x0694d842f4FC75CeF5e4f11B73029FAFc8931A07
// UniswapV2Deployment#WETH - 0x8f38a4fc01694e344b388e842273891ae5608592
// UniswapV2Deployment#UniswapV2Router02 - 0x36cA8427EC536a0AcF69E563aaF27D4f79c2f9Ea
////////////////////
// UniswapV2Deployment#UniswapV2Factory - 0xC1414e0db9AEF4c3d2893eEE85fFB899095aB0Ba
// UniswapV2Deployment#WETH - 0x94348bF2f5085AdbCA259dBcB0429408C233a573
// UniswapV2Deployment#UniswapV2Router02 - 0x5E20c79dA0908ED42bbc30CC729D374FBb703BdD