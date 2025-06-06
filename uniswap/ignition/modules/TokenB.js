import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyTokenBModule", (m) => {
  // Pass the initial owner address as a parameter when deploying
  const initialOwner = "0x13A538AEa48B39b17915eCb001f5330131c36a1A";

  if (!initialOwner) {
    throw new Error("Parameter 'initialOwner' is required");
  }

  const myTokenB = m.contract("MyTokenB", [initialOwner]);

  return { myTokenB };
});
//MyTokenBModule#MyTokenB - 0xaB90f7dF2EA8e6015d5204737F5187f135682a6C