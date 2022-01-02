import { useState } from "react";

import SectionTitle from "../SectionTitle/SectionTitle";

import styles from './Performance.module.scss';

import { getPerformance, getTradedPeriod } from "../../utils";

const Performance = ({profile}) => {

    const [selectedPerformance, setSelectedPerformance] = useState(getPerformance(profile.performance, profile.baseCoin))

    return ( 

        <div className={styles["performance"]}>

            <div className={styles["performance__title-basecoins"]}>
                <SectionTitle title={"Performance"} />
                <div className={styles["performance__basecoins"]}>
                    {profile.performance.map((p)=>
                        <div className={`${styles["performance__basecoin"]} ${styles[p.baseCoin === selectedPerformance.baseCoin ? "performance__basecoin__selected" : ""]}`} onClick={()=>setSelectedPerformance(getPerformance(profile.performance, p.baseCoin))}>{p.baseCoin}</div>
                    )}
                </div>
            </div>

            <div className={styles["performance__stats"]}>

                <div className={styles["performance__stat"]}>
                    <div className={styles["performance__stat-label"]}>Profit</div>
                    <div className={styles["performance__stat-value"]}>{(selectedPerformance.return * 100).toFixed(2)}%</div>
                </div>
                <div className={styles["performance__stat"]}>
                    <div className={styles["performance__stat-label"]}>Period</div>
                    <div className={styles["performance__stat-value"]}>{getTradedPeriod(selectedPerformance.started, selectedPerformance.lastUpdated)}</div>
                </div>
                <div className={styles["performance__stat"]}>
                    <div className={styles["performance__stat-label"]}>Risk</div>
                    <div className={styles["performance__stat-value"]}>moderate</div>
                </div>

            </div>
        </div>

     );
}
 
export default Performance;