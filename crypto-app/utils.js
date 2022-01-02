export const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

export const unixToDate = (timestamp)=>{

    var date = new Date(timestamp);

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

}

export const buildTradeRow = (trade) =>{

    return {
        symbol: trade.symbol,
        type: trade.isBuyer ? "Buy" : "Sell",
        price: trade.price,
        date: unixToDate(trade.time), 
    }

}

export const getPerformance = (performances, baseCoin) => {

    for(let p in performances){
        if(performances[p].baseCoin === baseCoin){
            return performances[p]
        }
    }

}

export const getTradedPeriod = (from, to) => {

    let period = new Date(to) - new Date(from);

    let days = Math.round((period / 1000) / 86400)

    let suffix = "d";
    let number = days;

    if(days > 30){
        suffix = "m";
        number = Math.round(days / 30)
    }

    if(days >= 365){
        suffix = "y";
        number = (days / 365).toFixed(1)
    }

    return number + suffix;

}