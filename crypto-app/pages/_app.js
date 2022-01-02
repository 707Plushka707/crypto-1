import Layout from '../components/layouts/Layout'
import '../styles/globals.css'

import '../styles/Globals.scss'

function MyApp({ Component, pageProps }) {
  return (
  
  <Layout>
    <Component {...pageProps} />
  </Layout>
  
  )
}

export default MyApp
