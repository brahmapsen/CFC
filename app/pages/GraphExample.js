import { useQuery, gql } from "@apollo/client"

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

export default function GraphExample() {
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS)
  console.log("Data:", data)
  return <div>Hi</div>
}
