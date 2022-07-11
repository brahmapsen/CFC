import { gql } from "@apollo/client"

// const GET_ACTIVE_ITEMS = gql`{
//   activeItems(first: 5) {
//     id
//     seller
//     nftAddress
//     tokenId
//   }
// }`

const GET_ACTIVE_ITEMS = gql`
  {
    nftissueds(first: 5) {
      id
      to
      uri
      amount
    }
  }
`

export default GET_ACTIVE_ITEMS
