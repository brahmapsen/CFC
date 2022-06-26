import Image from "next/image"
import styles from "../styles/Home.module.css"
import { useMoralisQuery } from "react-moralis"
import Layout from "../components/Layout"

export default function Defi() {
  return (
    <Layout>
      <div className={styles.container}>DeFI</div>
    </Layout>
  )
}
