import { ConnectButton } from "web3uikit"
import Link from "next/link" // Dynamic routing
import { useChain, useMoralis } from "react-moralis"

export default function Header() {
  const { switchNetwork, chainId, chain, account } = useChain()
  const { isWeb3Enabled } = useMoralis()
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h3 className="py-4 px-4 font-bold text-3xl">
        <a href="http://localhost:3000/">CFC!</a>
      </h3>
      {isWeb3Enabled ? (
        <div className="flex flex-row items-center">
          <Link href={`/result`}>
            <a className={"ml-auto py-8 px-4"}>
              <h3>
                <b>Post Result</b>
              </h3>
            </a>
          </Link>
          <Link href={`/Fund`}>
            <a className={"ml-auto py-8 px-4"}>
              <h3>
                <b>Fund Research</b>
              </h3>
            </a>
          </Link>
          <Link href={`/defi`}>
            <a className={"ml-auto py-8 px-4"}>
              <h6>
                <b>Grow Fund</b>
              </h6>
            </a>
          </Link>
          <Link href={`/DepositForm`}>
            <a className="mr-4 p-6">Payer Deposit</a>
          </Link>
        </div>
      ) : (
        <div>No Metamask detected .....</div>
      )}
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
        <button className="border-b-2" onClick={() => switchNetwork("0x4")}>
          Switch Network
        </button>
      </div>
    </nav>
  )
}
