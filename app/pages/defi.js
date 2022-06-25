import Image from 'next/image'
import styles from "../styles/Home.module.css"
import { useMoralisQuery } from 'react-moralis'
//import NFTBox from '../components/NftBox'

export default function Defi() {

  const { data: listedNfts, isFetching: fetchingListedNfts} = useMoralisQuery(
      //TableName //Function
      "ActiveItem", (query) => query.limit(10).descending("tokenId")
  )
  console.log(listedNfts)

  return(
    <div className={styles.container}>
      DeFI
      { fetchingListedNfts ? (<div>Loading.....</div>) : listedNfts.map((nft) => {
        console.log("nft.attributes")
        const { price, nftAddress, tokenId, marketplaceAddress, seller } = nft.attributes
        return(
          <div>
            Price: {price}. NftAddress: {nftAddress}. tokenId: {tokenId}. Seller: {seller}. 
            {/* <NFTBox
                price= {price} 
                NftAddress= {nftAddress} 
                tokenId= {tokenId}
                 marketplaceAddress ={marketplaceAddress}
                 seller = {seller}
                 key={`${nftAddress}${tokenId}`}
            /> */}
          </div>
        )
      })}
    </div>
  )

}