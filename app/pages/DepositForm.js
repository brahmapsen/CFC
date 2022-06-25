import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import abi from "../constants/PayForSuccess.json"
import tokenAbi from "../constants/PayForSuccessToken.json"
import { NFT, NFTBalance, Form, Button, Checkbox, Input } from "web3uikit"
import { ethers } from "ethers"
import Layout from "../components/Layout"
import networkMapping from "../constants/networkMapping.json"
import NFTBox from "../components/NFTBox"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"

import { useNotification } from "web3uikit"

import basicCFCNftAbi from "../constants/BasicCFCNft.json"

//Should be replacec with call from the Basic NFT contract.
const TOKEN_URI = "ipfs://QmSumRkgBY7PzatJ6ncYdZUdo3h6w6efHEvitUPArDaiB6"

export default function DepositForm() {
  const { chainId, isWeb3Enabled, account } = useMoralis()
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  console.log("CHAIN ID", chainId, chainString)
  const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

  const dispatch = useNotification()

  const PFS_CONTRACT_ADDRESS = networkMapping[chainString].PayForSuccess[0]
  console.log("PFS CONTRACT ADDRESS: ", PFS_CONTRACT_ADDRESS)

  const PFST_TOKEN_ADDRESS = networkMapping[chainString].PayForSuccessToken[0]
  //console.log("PFST TOKEN ADDRESS: ", PFST_TOKEN_ADDRESS)

  const BASIC_CFC_NFT_ADDRESS = networkMapping[chainString].BasicCFCNft[0]
  console.log("PFST BASIC_CFC_NFT_ADDRESS ADDRESS: ", BASIC_CFC_NFT_ADDRESS)

  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

  const { runContractFunction } = useWeb3Contract()
  const [contractName, setContractName] = useState("")
  const [userDepositAmt, setUserDepositAmt] = useState("0")
  const [totalTokenDeposited, setTotalTokenDeposited] = useState("0")
  const [userEthAmount, setUserEthAmount] = useState("")
  const [contractEthAmount, setContractEthAmount] = useState("")
  const [issueNFT, setIssueNFT] = useState("0")

  //view functions
  const { runContractFunction: getContractName } = useWeb3Contract({
    abi: abi,
    contractAddress: PFS_CONTRACT_ADDRESS,
    functionName: "getContractName",
    params: {},
  })

  let approveOptions = {
    abi: tokenAbi,
    contractAddress: PFST_TOKEN_ADDRESS,
    functionName: "approve",
  }

  let depositOptions = {
    abi: abi,
    contractAddress: PFS_CONTRACT_ADDRESS,
    functionName: "depositAssets",
  }

  let depositEthOptions = {
    abi: abi,
    contractAddress: PFS_CONTRACT_ADDRESS,
    functionName: "depositEth",
  }

  let nftIssuedOptions = {
    abi: abi,
    contractAddress: PFS_CONTRACT_ADDRESS,
    functionName: "issueNFT",
  }

  const { runContractFunction: mintbasicCFCNFT } = useWeb3Contract({
    abi: basicCFCNftAbi,
    contractAddress: BASIC_CFC_NFT_ADDRESS,
    functionName: "mintNft",
    params: {},
  })

  async function mintNFT() {
    console.log("\n.....................Minting NFT")
    const tokenId = await mintbasicCFCNFT({
      onError: (error) => console.log(error),
      onSuccess: () => {
        handleSuccess(tokenId)
      },
    })
    console.log("Minted Token Id:", tokenId)

    //call NFTIssued from PFS Contract
    const nftIssue = await NFTIssued()
  }

  async function NFTIssued() {
    nftIssuedOptions.params = {
      amount: 1,
      assetAddress: PFST_TOKEN_ADDRESS,
      uri: TOKEN_URI,
    }
    const tx = await runContractFunction({
      params: nftIssuedOptions,
      onError: (error) => console.log(error),
      onSuccess: () => {
        handleSuccess(tx)
      },
    })
  }

  //Toggle Issue NFT switch
  function handleIssueNft() {
    issueNFT ? setIssueNFT(0) : setIssueNFT(1)
    console.log(".................", issueNFT)
  }

  async function handleDeposit(data) {
    const token = data.data[0].inputResult
    const amtToApprove = data.data[1].inputResult
    console.log(" Token - ", token, " amt:", amtToApprove)

    if (token === "PFS Token") {
      approveOptions.params = {
        amount: amtToApprove, //ethers.utils.parseUnits(amtToApprove, "ether").toString(),
        spender: PFS_CONTRACT_ADDRESS,
      }
      console.log(`...approving...${amtToApprove}`)
      const tx = await runContractFunction({
        params: approveOptions,
        onError: (error) => console.log(error),
        onSuccess: () => {
          handleApproveSuccess(approveOptions.params.amount)
        },
      })
    } else {
      depositEthOptions.params = {
        value: amtToApprove * 10e17,
      }
      console.log(`.......ETH depositing......${depositEthOptions.params.value}`)

      const tx = await runContractFunction({
        params: depositEthOptions,
        onError: (error) => console.log(error),
        onSuccess: () => {
          handleSuccess(tx)
        },
      })
    }
  }

  async function handleApproveSuccess(amtToDeposit) {
    depositOptions.params = {
      amount: amtToDeposit,
      assetAddress: PFST_TOKEN_ADDRESS,
    }
    console.log(`.......depositing......${depositOptions.params.amount}`)

    const tx = await runContractFunction({
      params: depositOptions,
      onError: (error) => console.log(error),
      onSuccess: () => {
        handleSuccess(tx)
      },
    })
    //await tx.wait(1)
    //console.log("Transaction confirmed by 1 block")
  }

  //User account BALANCE for Asset passed
  const { runContractFunction: getUserAsset } = useWeb3Contract({
    abi: abi,
    contractAddress: PFS_CONTRACT_ADDRESS,
    functionName: "getUserAsset",
    params: { assetAddress: PFST_TOKEN_ADDRESS },
  })

  //Total Contract Token balance
  const { runContractFunction: getTotalTokenDeposited } = useWeb3Contract({
    abi: tokenAbi,
    contractAddress: PFST_TOKEN_ADDRESS,
    functionName: "balanceOf",
    params: { account: PFS_CONTRACT_ADDRESS },
  })

  const { runContractFunction: getUserEthAmount } = useWeb3Contract({
    abi: abi,
    contractAddress: PFS_CONTRACT_ADDRESS,
    functionName: "getUserEthAmount",
    params: {},
  })
  async function getUserEth() {
    let _amt = await getUserEthAmount()
    _amt = ethers.utils.formatEther(_amt)
    console.log("ETH amount:", _amt)
    setUserEthAmount(_amt)
  }

  async function getContractEthAmount() {
    _amt = await ethers.provider.getBalance(PFS_CONTRACT_ADDRESS)
    setContractEthAmount(_amt)
  }

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    })
  }

  // Probably could add some error handling
  const handleSuccess = async (tx) => {
    // if (chainString != 31337) {
    //   await tx.wait(1)
    // }
    handleNewNotification(tx)
    updateUI()
  }

  const handleError = async (tx) => {
    //await tx.wait(1)
    //updateUIValues()
    //handleNewNotification(tx)
    console.log("THE ERROR occured ")
  }

  async function updateUI() {
    const _name = await getContractName()
    setContractName(_name)

    const _userBal = await getUserAsset()
    setUserDepositAmt(_userBal.toString())

    const _totalTokenBal = await getTotalTokenDeposited()
    setTotalTokenDeposited(_totalTokenBal.toString())

    getUserEth()
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [])

  return (
    <Layout>
      <div>
        {" "}
        <div>
          <Input label="Contract Name:" name="contract-name" value={contractName} />{" "}
        </div>{" "}
        <br />
        <div>
          <Input
            label="Total CFC Token deposited in Contract:"
            name="contract-total-cfc"
            value={totalTokenDeposited}
          />
        </div>
        <br />
        <div>
          <Input
            label="CFC Token funded by User:"
            name="contract-total-cfc"
            value={userDepositAmt}
          />
        </div>
        <br />
        <div>
          <Input label="ETH funded by User:" name="contract-total-cfc" value={userEthAmount} />
        </div>
        <br />
        <div>
          <Checkbox
            id="issue-nft-checkbox"
            label="Issue NFT?"
            name="Issue NFT"
            onBlur={function noRefCheck() {}}
            onChange={handleIssueNft}
          />
        </div>
        <br />
        <Form
          onSubmit={handleDeposit}
          data={[
            {
              name: "Asset Type",
              selectOptions: [
                {
                  id: "PFST",
                  label: "PFS Token",
                },
                {
                  id: "eth",
                  label: "Native Ethereum",
                },
                {
                  id: "DAI",
                  label: "DAI Token",
                },
              ],
              type: "select",
              value: "",
            },
            {
              inputWidth: "50%",
              name: "Amount to deposit ",
              type: "number",
              value: "",
              key: "amountToStake",
            },
          ]}
          title="Donate!!!"
        ></Form>
      </div>

      <div>
        <Button
          id="mint-nft"
          onClick={mintNFT}
          size="medium"
          text="Mint NFT for Donation"
          theme="primary"
          type="button"
        />

        {/* <NFT
              address="0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"
              chain="eth"
              fetchMetadata
              tokenId="1"
            />
            <NFTBalance
            address="0x951Eb8643E48A3B6d6d6AA7706B643AEE9B42f52"
            chain="eth"
            /> */}
      </div>

      <div className="container mx-auto">
        <h1 className="py-4 px-4 font-bold text-2xl">NFT issued to the User</h1>
        <div className="flex flex-wrap">
          {isWeb3Enabled ? (
            loading || !listedNfts ? (
              <div>Loading...</div>
            ) : (
              listedNfts.activeItems.map((nft) => {
                //console.log(nft)
                const { price, nftAddress, tokenId, seller } = nft
                return (
                  <div>
                    <NFTBox
                      price={price}
                      nftAddress={nftAddress}
                      tokenId={tokenId}
                      marketplaceAddress={marketplaceAddress}
                      seller={seller}
                      key={`${nftAddress}${tokenId}`}
                    />
                  </div>
                )
              })
            )
          ) : (
            <div>Web3 Currently Not Enabled</div>
          )}
        </div>
      </div>
    </Layout>
  )
}
