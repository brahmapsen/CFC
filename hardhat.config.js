/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("hardhat-deploy")
require("dotenv").config()
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")

require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("./tasks/block-number")
require("hardhat-gas-reporter")

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""

module.exports = {
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
      saveDeployments: true,
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  solidity: {
    compilers: [{ version: "0.8.7" }, { version: "0.6.6" }],
  },
  // gasReporter: {
  //   enabled: true,
  //   outputFile: "gas-report.txt",
  //   noColors: true,
  //   currency: "USD",
  //   coinmarketcap: COINMARKETCAP_API_KEY,
  //   //token: "MATIC",
  // },
}
