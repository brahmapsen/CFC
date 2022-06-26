import { useState, useEffect } from "react" // State management
import Layout from "../components/Layout" // Layout wrapper
//import { web3 } from "@containers/index"; // Web3 container
import styles from "../styles/pages/Create.module.scss" // Page styles
import { useRouter } from "next/router" // Router

//import { ethers } from 'ethers';

import { useChain } from "react-moralis"
const SuperfluidSDK = require("@superfluid-finance/js-sdk")
const { Web3Provider } = require("@ethersproject/providers")

const DAIx_rinkeby = "0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90"

const useStyles = () => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardGrid: {
    paddingBottom: theme.spacing(8),
  },
  link: {
    textDecoration: "none",
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.15s ease-in-out",
  },
  cardHovered: {
    transform: "scale3d(1.05, 1.05, 1)",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  bold: {
    fontWeight: 600,
  },
})

export default function Funding() {
  const { switchNetwork, chainId, chain, account } = useChain()
  //const provider = new ethers.providers.Web3Provider(window.ethereum);
  const router = useRouter() // Router navigation
  // Global state
  //const { address  } = web3.useContainer();

  const [sf, setSf] = useState(null)
  const [fundingUser, setFundingUser] = useState(null)
  const [fundingRecipient, setFundingRecipient] = useState(null)
  const [fundingFlow, setFundingFlow] = useState(null)

  const [senderAddress, setSenderAddress] = useState(0)
  const [receiverAddress, setReceiverAddress] = useState(0)

  const flowRate = "385802469136"
  //(385802469135802 * 3600 * 24 * 30) / 1e18 ;//999.99999999999989 DAIx per month

  console.log("Account:", account)

  const startFlow = async () => {
    console.log("recipient: " + fundingRecipient)

    await fundingUser.flow({
      recipient: fundingRecipient,
      flowRate: flowRate, //'385802469136'  //1 DAIx per month
    })

    const details = await fundingUser.details()
    setFundingFlow(details.cfa.netFlow)
    console.log(details.cfa.netFlow)
  }

  const stopFlow = async (recipient) => {
    await fundingUser.flow({
      recipient: recipient,
      flowRate: "0",
    })
  }

  //Once fundng flows, we can view the flow from funding user to recipient
  const getFundingFlow = async () => {
    !fundingUser
      ? alert("User may not be connected to network")
      : setFundingFlow((await fundingUser.details()).cfa.netFlow)
  }

  const getSubscribers = async () => {
    let receivers
    if (fundingUser) {
      const outFlows = (await fundingUser.details()).cfa.flows.outFlows
      receivers = outFlows.map((x) => x.receiver)
      console.log("Receivers: " + receivers)
    }
  }

  function updateRecipient(recipient) {
    setFundingRecipient(recipient)
  }

  //initialize Superfluid stuff
  const initSuperFluid = async () => {
    const sf = new SuperfluidSDK.Framework({
      ethers: new Web3Provider(window.ethereum),
    })

    await sf.initialize()
    setSf(sf)

    const fundingUser = sf.user({
      address: "0x343712AbA29A21c9eB50Cc98D556028485146913", //was address
      token: DAIx_rinkeby,
    })
    setFundingUser(fundingUser)

    const details = await fundingUser.details()
    console.log("funding details:", details, details.cfa.netFlow)
    //console.log("Recipient:", details.cfa.flows.outFlows[0].receiver);
    setFundingFlow(details.cfa.netFlow)

    if (!details.cfa.flows.outFlows[0]) {
      if (!details.cfa.flows.inFlows[0]) {
        console.log("No in/out flow exist")
      } else {
        setSenderAddress(details.cfa.flows.inFlows[0].sender)
        setReceiverAddress(details.cfa.flows.inFlows[0].receiver)
      }
    } else {
      setSenderAddress(details.cfa.flows.outFlows[0].sender)
      setReceiverAddress(details.cfa.flows.outFlows[0].receiver)
    }
  }

  useEffect(() => {
    initSuperFluid()
  }, [])

  return (
    <Layout>
      <div className="form-group">
        <div className={styles.create}>
          <div className={styles.create__grid}>
            <div className={styles.create__grid_left}>
              <h2>Impact Investor funding for Clinical Trial</h2>
              <br />
              <label htmlFor="clinicalTrialReserchAgency">
                Clinical Trial Research Agency:{" "}
              </label>{" "}
              &nbsp;&nbsp;
              <input
                id="clinicalTrialReserchAgency"
                type="text"
                placeholder="Address"
                value={fundingRecipient}
                onChange={(e) => updateRecipient(e.target.value)}
              />
            </div>
            <div className={styles.create__grid_right}>
              {!fundingRecipient ? (
                ""
              ) : (
                <div className="col-md-6 offset-md-3">
                  <div className={styles.funding__head}>
                    <img src={fundingRecipient} alt="Avatar" />
                    {fundingRecipient}
                    <h2>Awards</h2>
                  </div>
                </div>
              )}
              <div className={styles.show__smallmeia}>{"BPS................"}</div>
            </div>
          </div>
        </div>

        <div className={styles.create}>
          <div className={styles.create__grid}>
            <div className={styles.create__grid_left}>
              <h2>Funding Details</h2>
              <label htmlFor="fundingFlow">Funding Flow: </label> &nbsp;&nbsp; {fundingFlow}
              <br />
              <label htmlFor="SenderAddress">Sender Address: </label>&nbsp;&nbsp;{senderAddress}
              <br />
              <label htmlFor="receiverAddress">Receiver Address: </label>&nbsp;&nbsp;
              {receiverAddress}
            </div>
          </div>
        </div>

        <div>
          <button onClick={startFlow} className="btn btn-outline-warning">
            Start Funding
          </button>{" "}
          &nbsp;&nbsp;
          <button onClick={stopFlow} className="btn btn-outline-warning">
            Stop Funding
          </button>{" "}
          &nbsp;&nbsp;
          <button onClick={getSubscribers} className="btn btn-outline-warning">
            Funding details
          </button>
        </div>
      </div>
    </Layout>
  )
}
