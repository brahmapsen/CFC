import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Crowd Funded Cures</title>
        <meta name="description" content="A decentralized app" />
        <link rel="icon" href="/cfc-logo.png" />
      </Head>

      <main className={styles.main}>
        <h3 className={styles.title}>
          <a href="http://localhost:3000/">Crowd Funded Cures</a>
        </h3>

        <div className={styles.grid}>
          an inexpensive way to develop medicine for diseases by repurposing of patent-expired
          drugs
          <Image src="/pay4success-flow.png" alt="pfsflow" width={700} height={375} />
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer">
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/chainlink.jpeg" alt="chainlink" width={82} height={46} />
            &nbsp;&nbsp;
            <Image src="/moralis.jpeg" alt="Moralis" width={82} height={46} />
            &nbsp;&nbsp;
            <Image src="/ipfs.png" alt="IPFS" width={62} height={46} /> &nbsp;&nbsp;
          </span>
        </a>
      </footer>
    </div>
  )
}
