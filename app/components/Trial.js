import { useWeb3Contract } from "react-moralis"
import {abi} from '../constants/abi'

export default function Trial() {
  const amt = 1;
  const tokenAddress = "0x422fD040996d0235eF20093B16bC94F5Dff1f5F6"  //ZB2 in Rinkeby
  const altAccountAddress = "0xF799d14a89cBABC76c1a257a66Cdc7c727AA6061";

  // const { runContractFunction: depositAssets } = useWeb3Contract({
  //   abi:abi,
  //   contractAddress:"0x0E8b501f641dd4Cfa1F3CfC79bd9F1fc773024bf",
  //   functionName: "depositAssets",
  //   msgValue: "100000000000000000",  //0.1ETH
  //   params: {amt, tokenAddress, altAccountAddress},
  // })

  return (
    <div>
      <button onClick={ async () => {
        await depositAssets()
      }}> Trial Result  </button>

        <br/>
      <label> Submit Result</label>
      
    </div>
  )



}