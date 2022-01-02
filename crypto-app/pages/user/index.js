import * as  api from '../../api';

import SectionTitle from '../../components/SectionTitle/SectionTitle';
import UserCard from '../../components/UserCard/UserCard';
import UserDescription from '../../components/UserDescription/UserDescription';
import Performance from '../../components/Performance/Performance';
import AssetAllocation from '../../components/AssetAllocation/AssetAllocation';
import TradeHistory from '../../components/TradeHistory/TradeHistory';

import styles from '../../styles/User.module.scss'

export const getStaticProps = async()=>{

    const res = await api.getProfileData('sokenny')
    const data = await res.json()

    console.log('dataa:', data )

    return {
        props: {profile:data}
        // revalidate: 1,
    }
}

const Profile = ({profile}) => {    
    
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
                            <Performance />
                        </div>
                        
                        <div className={styles["user-info__module"]}>
                            <AssetAllocation assets={profile.assetAllocation} />
                        </div>
                        
                        <div className={styles["user-info__module"]}>
                            <TradeHistory />
                        </div>
                    </div>
                </div>


            </div>
        </>

     );
}
 
export default Profile;