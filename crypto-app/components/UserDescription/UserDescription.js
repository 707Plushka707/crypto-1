import styles from './UserDescription.module.scss'

const UserDescription = ({profile}) => {
    return ( 

        <div className={styles["user-description"]}>
            
            <div className={styles["user-description__main"]}>
                <div className={styles["user-description__user"]}>
                    {profile.username}
                </div>

                <div className={styles["user-description__name"]}>
                    {profile.name}
                </div>
            </div>

            <div className={styles["user-description__description"]}>
                I buy only top coins, trade without stop loss and average positions. I am looking for iron entry points.
            </div>

        </div>

     );
}
 
export default UserDescription;