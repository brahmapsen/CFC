import { gql} from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`{
  activeItems(first: 5) {
    id
    seller
    nftAddress
    tokenId
  }
}`

export default GET_ACTIVE_ITEMS