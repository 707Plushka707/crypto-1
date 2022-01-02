import Head from 'next/head';

const Layout = ({children}) => {
    return ( 

        <>
            <Head>
                <title>Crypto</title>
            </Head>

            {children}
        </>

     );
}
 
export default Layout;