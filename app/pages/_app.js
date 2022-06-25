import '../styles/globals.css'
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
//const APP_ID=process.env.NEXT_PUBLIC_MORALIS_APP_ID
//const SERVER_URL=process.env.NEXT_PUBLIC_MORALIS_SERVER_URL

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/29173/cfc/v.0.0.2",
})

function MyApp({ Component, pageProps }) {
  return (
    // <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <NotificationProvider>
            <Component {...pageProps} />
        </NotificationProvider>
      </ApolloProvider>
    </MoralisProvider>
  )
}

export default MyApp
