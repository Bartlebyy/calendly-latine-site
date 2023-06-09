import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'

const DynamicMap = dynamic(() => import('../components/Map'), {
  ssr: false, // Disable server-side rendering
})

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Latine BG</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Latine Belonging Group
        </h1>

        <p className={styles.description}>
          Connecting Through Culture and Location: Discover the Homes and Heritages of Our Group Members
        </p>

        <div className={styles.grid}>
          <span className={styles.flag}>
            <Image src="/flags/mexico.png" alt="Mexico Flag" width={100} height={100} />
          </span>
          <span className={styles.flag}>
            <Image src="/flags/venezuela.png" alt="venezuela Flag" width={100} height={100} />
          </span>
          <span className={styles.flag}>
            <Image src="/flags/cuba.png" alt="cuba Flag" width={100} height={100} />  
          </span>
          <span className={styles.flag}>
            <Image src="/flags/nicaragua.png" alt="nicaragua Flag" width={100} height={100} />
          </span>
          <span className={styles.flag}>
            <Image src="/flags/brazil.png" alt="brazil Flag" width={100} height={100} />
          </span>
          <span className={styles.flag}>
            <Image src="/flags/colombia.png" alt="colombia Flag" width={100} height={100} />
          </span>
          <span className={styles.flag}>
            <Image src="/flags/dominican-republic.png" alt="dominican-republic Flag" width={100} height={100} />  
          </span>
          <span className={styles.flag}>
            <Image src="/flags/el-salvador.png" alt="el-salvador Flag" width={100} height={100} />
          </span>
          <span className={styles.flag}>
            <Image src="/flags/guatemala.png" alt="guatemala Flag" width={100} height={100} />
          </span>
          <span className={styles.flag}>
            <Image src="/flags/haiti.png" alt="haiti Flag" width={100} height={100} />
          </span>
          <span className={styles.flag}>
            <Image src="/flags/puerto-rico.png" alt="puerto-rico Flag" width={100} height={100} />  
          </span>
        </div>
        
        <div className={styles.map}>
          <DynamicMap/>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://www.flaticon.com/packs/international-flags-3" title="Flag icons">Flag icons created by Freepik - Flaticon</a>
      </footer>
    </div>
  )
}
