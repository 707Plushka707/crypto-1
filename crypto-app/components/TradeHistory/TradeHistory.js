import SectionTitle from '../SectionTitle/SectionTitle';
import TradeRow from '../TradeRow/TradeRow';

import styles from './TradeHistory.module.scss';

const TradeHistory = ({ths}) => {

    const trades = [
        {symbol: "ETH-BTC", type: "buy", price:0.0727, date: "11/09/2021", return: "5.56%"},
        {symbol: "ETH-BTC", type: "buy", price:0.0727, date: "11/09/2021", return: "5.56%"},
        {symbol: "ETH-BTC", type: "buy", price:0.0727, date: "11/09/2021", return: "5.56%"},
        {symbol: "ETH-BTC", type: "buy", price:0.0727, date: "11/09/2021", return: "5.56%"},
        {symbol: "ETH-BTC", type: "buy", price:0.0727, date: "11/09/2021", return: "5.56%"},
        {symbol: "ETH-BTC", type: "buy", price:0.0727, date: "11/09/2021", return: "5.56%"},
    ]

    return ( 
        <div className={styles["trade-history"]}>

            <SectionTitle title={"Trade History"} />
            <div className={styles["trade-history__table"]}>

                <div className={styles["trade-history__trades"]}>
                    {ths.slice(0, 5).map((trade,i)=>
                        <TradeRow trade={trade} key={trade.time + i} />
                    )}
                </div>

                <div className={styles["trade-row__view-more"]}>view more</div>

            </div>

        </div>
     );
}
 
export default TradeHistory;