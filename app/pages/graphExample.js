import { useQuery, gql} from "@apollo/client"
//import NFTBox from "../components/NftBox"

const GET_ACTIVE_ITEMS = gql`{
  activeItems(first: 5) {
    id
    seller
    nftAddress
    tokenId
  }
}`

export default function graphExample() {
       const {loading, error, data } = useQuery(GET_ACTIVE_ITEMS)
       console.log("Data:", data)
       return(
         <div>Hi</div>
       )
}