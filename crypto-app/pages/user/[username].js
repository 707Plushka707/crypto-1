import * as  api from '../../api';

import SectionTitle from '../../components/SectionTitle/SectionTitle';
import UserCard from '../../components/UserCard/UserCard';
import UserDescription from '../../components/UserDescription/UserDescription';
import Performance from '../../components/Performance/Performance';
import AssetAllocation from '../../components/AssetAllocation/AssetAllocation';
import TradeHistory from '../../components/TradeHistory/TradeHistory';

import styles from '../../styles/User.module.scss';
import User from '../../../server/models/user';
import { useEffect, useState } from 'react';

export const getStaticPaths = async()=>{

    const res = await api.getUsers()
    const data = await res.json()

    const paths = data.map(user => {
        return {
            params: {username:user.username}
        }
    })

    return {
        paths,
        fallback: false
    }
}

export const getStaticProps = async(context)=>{
    const username = context.params.username;
    const res = await api.getProfileData(username)
    const data = await res.json()

    console.log('dataa:', data )

    console.log('us: ', username)

    return {
        props: {profile:data},
        revalidate: 1,
    }
}

const Profile = ({profile}) => {    

    const [tradeHistory, setTradeHistory] = useState([])

    useEffect(()=>{
        console.log('tradeHistory; ', tradeHistory)
    })

    useEffect(async ()=>{

        // Buscamos el tradeHistory
        let tradeHistory = await api.getTradeHistory({id: profile.id, limit: 20})
        tradeHistory = await tradeHistory.json()

        setTradeHistory(tradeHistory)

    }, [])
    
    return ( 
        
        <>
            <div className="center-section">
                <div className={styles["user-info"]}>
                    <div className={styles["user-info__user-card"]}>
                        <UserCard />
                    </div>
                    <div className={styles["user-info__info-body"]}>
                        <div className={styles["user-info__user-description"]}>
                            <UserDescription profile={profile} />
                        </div>
                        <div className={styles["user-info__module"]}>
                            <Performance profile={profile} />
                        </div>
                        
                        <div className={styles["user-info__module"]}>
                            <AssetAllocation assets={profile.assetAllocation} />
                        </div>
                        
                        <div className={styles["user-info__module"]}>
                            <TradeHistory ths={tradeHistory} />
                        </div>
                    </div>
                </div>


            </div>
        </>

     );
}
 
export default Profile;