import SectionTitle from '../SectionTitle/SectionTitle';
import Asset from '../Asset/Asset';

import styles from './AssetAllocation.module.scss';

const AssetAllocation = ({assets}) => {

    return ( 

        <div className={styles["asset-allocation"]}>
            <SectionTitle title={"Asset Allocation"} />

            <div className={styles["asset-allocation__assets"]}>

                {assets.map((asset)=>
                    <Asset asset={asset} key={asset.coin} />
                ) }

            </div>

        </div>

     );
}
 
export default AssetAllocation;