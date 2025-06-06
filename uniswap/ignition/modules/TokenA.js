import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyTokenAModule", (m) => {
  // Pass the initial owner address as a parameter when deploying
  const initialOwner = "0x13A538AEa48B39b17915eCb001f5330131c36a1A";

  if (!initialOwner) {
    throw new Error("Parameter 'initialOwner' is required");
  }

  const myTokenA = m.contract("MyTokenA", [initialOwner]);

  return { myTokenA };
});
//MyTokenAModule#MyTokenA - 0x78cefc72DDB436a254F3b540f4D0663f84bF651d