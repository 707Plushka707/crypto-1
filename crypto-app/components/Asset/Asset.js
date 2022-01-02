import styles from './Asset.module.scss';

const Asset = ({asset}) => {
    return ( 
        <div className={styles["asset"]}>

            <div className={styles["asset__icon"]}>

            </div>

            <div className={styles["asset__info"]}>
                <div className={styles["asset__coin"]}>{asset.coin}</div>
                <div className={styles["asset__percentage"]}>{Math.round(asset.percentage)}%</div>
            </div>

        </div>
     );
}
 
export default Asset;