import { defineConfig } from "hardhat/config";
import "dotenv/config";

export default defineConfig({
  solidity: {
    version: "0.8.28",
  },
  networks: {
    baseSepolia: {
      type: "http",
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      chainId: 84532,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
});
