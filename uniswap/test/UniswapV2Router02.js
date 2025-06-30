const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("UniswapV2Router02", function () {
  async function deployUniswapFixture() {
    const [owner, addr1] = await ethers.getSigners();
    //  console.log("owner is :",owner.address)

    // Deploy WETH
    const WETH9 = await ethers.getContractFactory("WETH");
    const weth = await WETH9.deploy();
    await weth.waitForDeployment();
    // console.log("WETH", weth.target)

    // Deploy Token A
    const TokenA = await ethers.getContractFactory("MyTokenA");
    const tokenA = await TokenA.deploy(owner.address);
    await tokenA.waitForDeployment();
    // console.log("token A", tokenA.target)
    // Deploy Token B
    const TokenB = await ethers.getContractFactory("MyTokenB");
    const tokenB = await TokenB.deploy(owner.address);
    await tokenB.waitForDeployment();
    // console.log("token B", tokenB.target)

    // Mint tokens to owner
    await tokenA.mint(owner.address, ethers.parseUnits("10000", 18));
    await tokenB.mint(owner.address, ethers.parseUnits("10000", 18));

    // Deploy factory
    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    const factory = await Factory.deploy(owner.address);
    await factory.waitForDeployment();
    // console.log("factory",factory.target)

    // Deploy router
    const Router = await ethers.getContractFactory("UniswapV2Router02");
    const router = await Router.deploy(factory.target, weth.target);
    await router.waitForDeployment();
    // console.log("router",router.target)

    // Approve router
    await tokenA.approve(router.target, ethers.MaxUint256);
    await tokenB.approve(router.target, ethers.MaxUint256);

    // Add liquidity
    await router.addLiquidity(
      tokenA.target,
      tokenB.target,
      ethers.parseUnits("10000", 18),
      ethers.parseUnits("10000", 18),
      0,
      0,
      owner.address,
      Math.floor(Date.now() / 1000) + 1000
    );

    // Get pair address and attach
    const pairAddress = await factory.getPair(tokenA.target, tokenB.target);
    const Pair = await ethers.getContractFactory("UniswapV2Pair");
    const pair = await Pair.attach(pairAddress);

    return {
      owner,
      addr1,
      tokenA,
      tokenB,
      weth,
      factory,
      router,
      pair,
    };
  }

  it("should add liquidity and mint LP tokens", async () => {
    const { owner, pair } = await loadFixture(deployUniswapFixture);
    const lpBalance = await pair.balanceOf(owner.address);
    expect(lpBalance).to.be.gt(0);
  });

  it("should swap tokenA for tokenB", async () => {
    const { owner, addr1, tokenA, tokenB, router } = await loadFixture(
      deployUniswapFixture
    );
    await tokenA.mint(owner.address, ethers.parseUnits("10000", 18));

    //  const ownerBalance = await tokenA.balanceOf(owner.address);
    // console.log("Owner tokenA balance:", ownerBalance.toString());
    // Transfer and approve
    await tokenA
      .connect(owner)
      .transfer(addr1.address, ethers.parseUnits("1.5", 18));
    await tokenA
      .connect(addr1)
      .approve(router.target, ethers.parseUnits("1", 18));

    // Swap
    const path = [tokenA.target, tokenB.target];
    await router
      .connect(addr1)
      .swapExactTokensForTokens(
        ethers.parseUnits("1", 18),
        0,
        path,
        addr1.address,
        Math.floor(Date.now() / 1000) + 100
      );

    const balance = await tokenB.balanceOf(addr1.address);
    expect(balance).to.be.gt(0);
  });

  it("should remove liquidity", async () => {
    const { owner, tokenA, tokenB, router, pair } = await loadFixture(
      deployUniswapFixture
    );

    const lpBalance = await pair.balanceOf(owner.address);
    await pair.approve(router.target, lpBalance);

    await router.removeLiquidity(
      tokenA.target,
      tokenB.target,
      lpBalance,
      0,
      0,
      owner.address,
      Math.floor(Date.now() / 1000) + 100
    );

    const finalBalance = await pair.balanceOf(owner.address);
    expect(finalBalance).to.equal(0);
  });
  it("should fail to swap without token approval", async () => {
    const { owner, addr1, tokenA, tokenB, router } = await loadFixture(
      deployUniswapFixture
    );
    await tokenA.mint(owner.address, ethers.parseUnits("10000", 18));
    await tokenA
      .connect(owner)
      .transfer(addr1.address, ethers.parseUnits("1.5", 18));
    // No approval

    const path = [tokenA.target, tokenB.target];

    await expect(
      router
        .connect(addr1)
        .swapExactTokensForTokens(
          ethers.parseUnits("1", 18),
          0,
          path,
          addr1.address,
          Math.floor(Date.now() / 1000) + 100
        )
    ).to.be.revertedWith("TransferHelper: TRANSFER_FROM_FAILED");
  });

  it("should fail to swap if balance is insufficient", async () => {
    const { addr1, tokenA, tokenB, router } = await loadFixture(
      deployUniswapFixture
    );

    await tokenA
      .connect(addr1)
      .approve(router.target, ethers.parseUnits("1", 18));

    const path = [tokenA.target, tokenB.target];
    await expect(
      router
        .connect(addr1)
        .swapExactTokensForTokens(
          ethers.parseUnits("1", 18),
          0,
          path,
          addr1.address,
          Math.floor(Date.now() / 1000) + 100
        )
    ).to.be.revertedWith("TransferHelper: TRANSFER_FROM_FAILED");
  });
  it("should swap tokenB for tokenA", async () => {
    const { owner, addr1, tokenA, tokenB, router } = await loadFixture(
      deployUniswapFixture
    );
    await tokenB.mint(owner.address, ethers.parseUnits("10000", 18));
    await tokenB
      .connect(owner)
      .transfer(addr1.address, ethers.parseUnits("2", 18));
    await tokenB
      .connect(addr1)
      .approve(router.target, ethers.parseUnits("1", 18));

    const path = [tokenB.target, tokenA.target];
    await router
      .connect(addr1)
      .swapExactTokensForTokens(
        ethers.parseUnits("1", 18),
        0,
        path,
        addr1.address,
        Math.floor(Date.now() / 1000) + 100
      );

    const balance = await tokenA.balanceOf(addr1.address);
    expect(balance).to.be.gt(0);
  });
  it("should revert if deadline has passed", async () => {
    const { owner, addr1, tokenA, tokenB, router } = await loadFixture(
      deployUniswapFixture
    );
    await tokenA.mint(owner.address, ethers.parseUnits("10000", 18));

    await tokenA
      .connect(owner)
      .transfer(addr1.address, ethers.parseUnits("1", 18));
    await tokenA
      .connect(addr1)
      .approve(router.target, ethers.parseUnits("1", 18));

    const path = [tokenA.target, tokenB.target];

    const pastDeadline = Math.floor(Date.now() / 1000) - 100;

    await expect(
      router
        .connect(addr1)
        .swapExactTokensForTokens(
          ethers.parseUnits("1", 18),
          0,
          path,
          addr1.address,
          pastDeadline
        )
    ).to.be.revertedWith("UniswapV2Router: EXPIRED");
  });
  it("should return correct output from getAmountsOut", async () => {
    const { tokenA, tokenB, router } = await loadFixture(deployUniswapFixture);

    const path = [tokenA.target, tokenB.target];
    const inputAmount = ethers.parseUnits("1", 18);

    const amountsOut = await router.getAmountsOut(inputAmount, path);
    expect(amountsOut[0]).to.equal(inputAmount);
    expect(amountsOut[1]).to.be.gt(0);
  });
  it("should add and remove liquidity and return tokens", async () => {
    const { owner, tokenA, tokenB, router, pair } = await loadFixture(
      deployUniswapFixture
    );

    const lpBalance = await pair.balanceOf(owner.address);
    await pair.approve(router.target, lpBalance);

    const beforeA = await tokenA.balanceOf(owner.address);
    const beforeB = await tokenB.balanceOf(owner.address);

    await router.removeLiquidity(
      tokenA.target,
      tokenB.target,
      lpBalance,
      0,
      0,
      owner.address,
      Math.floor(Date.now() / 1000) + 100
    );

    const afterA = await tokenA.balanceOf(owner.address);
    const afterB = await tokenB.balanceOf(owner.address);

    expect(afterA).to.be.gt(beforeA);
    expect(afterB).to.be.gt(beforeB);
  });
  it("should swap with exact output amount", async () => {
    const { owner, addr1, tokenA, tokenB, router } = await loadFixture(
      deployUniswapFixture
    );
    await tokenA.mint(owner.address, ethers.parseUnits("10000", 18));

    await tokenA.transfer(addr1.address, ethers.parseUnits("100", 18));
    await tokenA.connect(addr1).approve(router.target, ethers.MaxUint256);

    const path = [tokenA.target, tokenB.target];
    const amountOut = ethers.parseUnits("5", 18);

    const amountsIn = await router.getAmountsIn(amountOut, path);

    await router
      .connect(addr1)
      .swapTokensForExactTokens(
        amountOut,
        amountsIn[0],
        path,
        addr1.address,
        Math.floor(Date.now() / 1000) + 100
      );

    const balance = await tokenB.balanceOf(addr1.address);
    expect(balance).to.equal(amountOut);
  });
  it("should return correct amount from getAmountsOut", async () => {
    const { tokenA, tokenB, router } = await loadFixture(deployUniswapFixture);

    const amountIn = ethers.parseUnits("1", 18);
    const path = [tokenA.target, tokenB.target];
    const amounts = await router.getAmountsOut(amountIn, path);

    expect(amounts[0]).to.equal(amountIn);
    expect(amounts[1]).to.be.gt(0);
  });
  it("should revert if path is invalid", async () => {
    const { owner, addr1, tokenA, router } = await loadFixture(
      deployUniswapFixture
    );
    await tokenA.mint(owner.address, ethers.parseUnits("10000", 18));

    await tokenA.transfer(addr1.address, ethers.parseUnits("10", 18));
    await tokenA.connect(addr1).approve(router.target, ethers.MaxUint256);

    await expect(
      router.connect(addr1).swapExactTokensForTokens(
        ethers.parseUnits("1", 18),
        0,
        [tokenA.target], // invalid path
        addr1.address,
        Math.floor(Date.now() / 1000) + 100
      )
    ).to.be.revertedWith("UniswapV2Library: INVALID_PATH");
  });
  it("should fail to add liquidity if min amounts not met", async () => {
    const { tokenA, tokenB, router } = await loadFixture(deployUniswapFixture);

    await expect(
      router.addLiquidity(
        tokenA.target,
        tokenB.target,
        ethers.parseUnits("100", 18),
        ethers.parseUnits("100", 18),
        ethers.parseUnits("200", 18), // too high min
        ethers.parseUnits("200", 18), // too high min
        tokenA.target,
        Math.floor(Date.now() / 1000) + 100
      )
    ).to.be.revertedWith("UniswapV2Router: INSUFFICIENT_B_AMOUNT"); // or similar
  });
  it("should lose tokens on round-trip swap due to fee", async () => {
    const { owner, tokenA, tokenB, router } = await loadFixture(
      deployUniswapFixture
    );

    const initialAmount = ethers.parseUnits("10", 18);
    await tokenA.mint(owner.address, initialAmount);

    await tokenA.transfer(owner.address, initialAmount);
    await tokenA.approve(router.target, ethers.MaxUint256);

    const pathAB = [tokenA.target, tokenB.target];
    const pathBA = [tokenB.target, tokenA.target];

    const intermediateOut = await router.getAmountsOut(initialAmount, pathAB);
    await router.swapExactTokensForTokens(
      initialAmount,
      0,
      pathAB,
      owner.address,
      Math.floor(Date.now() / 1000) + 100
    );

    const finalOut = await router.getAmountsOut(intermediateOut[1], pathBA);
    await tokenB.approve(router.target, ethers.MaxUint256);
    await router.swapExactTokensForTokens(
      intermediateOut[1],
      0,
      pathBA,
      owner.address,
      Math.floor(Date.now() / 1000) + 100
    );

    const finalBalance = await tokenA.balanceOf(owner.address);
    expect(finalBalance).to.be.lt(initialAmount);
  });
  it("should fail to remove liquidity without approval", async () => {
    const { owner, router, pair, tokenA, tokenB } = await loadFixture(
      deployUniswapFixture
    );
    const lpBalance = await pair.balanceOf(owner.address);

    await expect(
      router.removeLiquidity(
        tokenA.target,
        tokenB.target,
        lpBalance,
        0,
        0,
        owner.address,
        Math.floor(Date.now() / 1000) + 100
      )
    ).to.be.revertedWithPanic(0x11);
  });
  it("should fail to remove liquidity without LP token approval", async () => {
    const { owner, tokenA, tokenB, router, pair } = await loadFixture(
      deployUniswapFixture
    );
    const lpBalance = await pair.balanceOf(owner.address);

    // Manually reset allowance to 0
    await pair.approve(router.target, 0);

    await expect(
      router.removeLiquidity(
        tokenA.target,
        tokenB.target,
        lpBalance,
        0,
        0,
        owner.address,
        Math.floor(Date.now() / 1000) + 100
      )
    ).to.be.revertedWithPanic(0x11);
  });
});
//all
