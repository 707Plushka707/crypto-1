import styles from './TradeRow.module.scss';

import { buildTradeRow } from '../../utils';

const TradeRow = ({trade}) => {

    let builtTrade = buildTradeRow(trade)
    const tradeValues = Object.keys(builtTrade)

    return ( 

        <div className={styles["trade-row"]}>
            <div className={styles["trade-row__inner"]}>
                {tradeValues.map((key, i)=>
                    <div className={styles["trade-row__cell"], styles["trade-row__cell__"+key]} key={key+i}>
                        {builtTrade[key]}
                    </div>
                )}
            </div>
        </div>

     );
}
 
export default TradeRow;