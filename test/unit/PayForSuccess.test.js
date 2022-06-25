const { messagePrefix } = require("@ethersproject/hash")
const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

describe("PayForSuccess", function () {
  let payForSuccess, payForSuccessFactory, user
  const sendValue = ethers.utils.parseEther("1")
  const zeroAddress = "0x0000000000000000000000000000000000000000"

  beforeEach(async function () {
    const { deployer } = await getNamedAccounts()
    user = deployer
    payForSuccessFactory = await ethers.getContractFactory("PayForSuccess")
    payForSuccess = await payForSuccessFactory.deploy(deployer)
  })

  // it("setup dummy", async function () {
  //   console.log("DUMMY")
  // })

  it("should display name", async () => {
    const contractName = await payForSuccess.getContractName()
    const expectedValue = "Pay4Success"
    assert.equal(contractName, expectedValue)
  })

  it("test contract eth value", async () => {
    await payForSuccess.depositEth({ value: sendValue })
    const resp = await payForSuccess.provider.getBalance(payForSuccess.address)
    console.log("resp:", resp.toString())

    const userAmt = await payForSuccess.UserEthInfo(user)
    console.log("User Amt:", userAmt.toString())
  })
})
