const Moralis = require("moralis/node")
require("dotenv").config()
const contractAddresses = require("./constants/networkMapping.json")

let chainId = process.env.chainId || 31337
let moralisChainId = chainId == "31337" ? "1337" : chainId

const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL
const masterKey = process.env.masterKey

const contractAddress = contractAddresses[chainId]["NftMarketplace"][0]

async function main(){
  await Moralis.start({serverUrl, appId, masterKey})
  console.log(`Working with contract address ${contractAddress}`)
  console.log(`AppID ${appId}`)
  console.log(`ServerURL ${serverUrl}`)
  console.log(`Master KEY ${masterKey}`)

  let itemListedOptions = {
      chainId: moralisChainId,
      sync_historical: true,
      topic: "ItemListed(address, address, uint256, uint256)",
      abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
    tableName: "ItemListed", 
  }

  const listedResponse = await Moralis.Cloud.run("watchContractEvent", itemListedOptions, {
    useMasterKey: true,
  })

  if (listedResponse.success ) {
    console.log(
        "Updated! You should now be able to see these tables in your database. \n Note: You won't be able to see the events on the `sync` tab of the UI though."
    )
  } else {
      console.log(
          "Something went wrong uploading events... Try manually importing for a better error code. "
      )
  }
  //
}

main()
  .then( () => process.exit(0))
  .catch( (error) => {
    console.error(error)
    process.exit(1)
  })