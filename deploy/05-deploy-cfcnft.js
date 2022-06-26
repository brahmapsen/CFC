const { deployments, getNamedAccounts, network, ethers } = require("hardhat")
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")
const { storeImages, storeTokeUriMetadata } = require("../utils/uploadToPinata")
const { verify } = require("../utils/verify")

const FUND_AMOUNT = "1000000000000000000000"
const gasLaneRinkeby = "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc"

const imagesLocation = "./images/"

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "level",
      value: 100,
    },
  ],
}

// This URI is a JSON file that contain information to NFT description, attributes
// and link to image associated with the NFT
//https://gateway.pinata.cloud/ipfs/Qmeg1gf9rBtoFim5GgdqdJExAvu39D59g3EkJHXyv8mko7
let tokenUris = [
  "ipfs://Qmeg1gf9rBtoFim5GgdqdJExAvu39D59g3EkJHXyv8mko7",
  "ipfs://QmSumRkgBY7PzatJ6ncYdZUdo3h6w6efHEvitUPArDaiB6",
  "ipfs://QmeGcu6L3fn4gzPHmy7vxKr3BG4JnrjRQKZjNS7FZYTsqT",
]

// const imageUris = [
//     "ipfs://QmVfZTHMEq2BC4PfoKheTEC3HWumm9RgxcpogZRwkARX4e",
//     "ipfs://QmTJ4ArwcAfuXZT9vAno3Hy6SPdAP4e4wW9hGjwXFswGLx",
//     "ipfs://QmSvRgYrLRuZ3arjtAnfcWhPm23sBkU9SUPZ88YXf3jHfU",
// ]

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  let vrfCoordinatorV2Address, subscriptionId

  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris()
  }

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  // if (chainId == 31337) {
  //   //Make a FAKE chainlink VRF node
  //   const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
  //   vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
  //   const tx = await vrfCoordinatorV2Mock.createSubscription()
  //   const txReceipt = await tx.wait(1)
  //   subscriptionId = txReceipt.events[0].args.subId
  //   await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
  // } else {
  //   //use real node ones
  //   vrfCoordinatorV2Address = "0x6168499c0cFfCaCD319c818142124B7A15E857ab"
  //   subscriptionId = "3863"
  // }

  // const args = [
  //   vrfCoordinatorV2Address,
  //   gasLaneRinkeby,
  //   subscriptionId,
  //   "500000", //callbackGasLimit
  //   tokenUris, //list of URIs
  // ]

  // const cfcNftContract = await deploy("CFCNft", {
  //   from: deployer,
  //   args: args,
  //   log: true,
  //   waitConfirmations: waitBlockConfirmations, //for local deployments, if it hangs, then comment this out
  // })

  // if (chainId != 31337) {
  //   log("Verifying....")
  //   await verify(cfcNftContract.address, args)
  // }
}

async function handleTokenUris() {
  // Check out https://github.com/PatrickAlphaC/nft-mix for a pythonic version of uploading
  // to the raw IPFS-daemon from https://docs.ipfs.io/how-to/command-line-quick-start/
  // You could also look at pinata https://www.pinata.cloud/
  tokenUris = []
  const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
  for (imageUploadResponseIndex in imageUploadResponses) {
    let tokenUriMetadata = { ...metadataTemplate }
    tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
    tokenUriMetadata.description = `A CFC NFT ${tokenUriMetadata.name} !`
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
    console.log(`Uploading ${tokenUriMetadata.name}...`)
    const metadataUploadResponse = await storeTokeUriMetadata(tokenUriMetadata)
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
  }
  console.log("Token URIs uploaded! They are:")
  console.log(tokenUris)
  return tokenUris
}

module.exports.tags = ["all", "cfcnft"]
