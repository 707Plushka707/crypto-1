export class Tracker {
    constructor(tradeCoin, baseCoin) {
      this.tradeCoin = tradeCoin;
      this.baseCoin = baseCoin;

      // this.deposits = 0;
      this.time = null;
      this.proceeds = 0;
      this.totalDeposits = 0;
      this.totalProceeds = 0;
      this.netDeposits = 0;
      this.netProceeds = 0;
      this.reinvested = 0;
      this.baseCoinPrice = 0;
      this.holdings = 0;
      this.marketValue = 0;
      this.MWR = 0; 
    }

    get snapshot(){
      return {...this}
    }

    newOrder(order, index){

      this.time = order.time
        
      if(order.isBuyer){
        this.totalDeposits += parseFloat(order.quoteQty)
        this.holdings += parseFloat(order.qty)

        if(this.proceeds>0){

          if(parseFloat(order.quoteQty) > this.proceeds){
            this.reinvested += this.proceeds
            this.proceeds = 0
          }else{
            this.reinvested += parseFloat(order.quoteQty)
            this.proceeds -= parseFloat(order.quoteQty)
          }

        }

      }else{
        this.proceeds += parseFloat(order.quoteQty)
        this.totalProceeds += parseFloat(order.quoteQty)
        this.holdings -= parseFloat(order.qty)
      }

      this.baseCoinPrice = parseFloat(order.price)
      this.marketValue = this.holdings * this.baseCoinPrice
      this.netDeposits = this.totalDeposits - this.reinvested
      this.netProceeds = this.totalProceeds - this.reinvested

      // Corrigiendo para que no haya negativos
      if(this.holdings < 0){
        this.holdings = 0
      }

      if(this.marketValue<0){
        this.marketValue = 0
      }


      this.MWR = parseFloat(((((this.marketValue + this.netProceeds) / this.netDeposits) - 1) * 100).toFixed(2))
      if(this.MWR === Infinity){
        this.MWR = 0
      }
      
    }
    
    getSymbolPairs(){

    }
}

export const appConfig = {
    minimumAssetPercentage: 0.005,
}

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const sortObjects = (objects, key)=>{

    function compare( a, b ) {
        if ( a[key] < b[key] ){
        return -1;
        }
        if ( a[key] > b[key] ){
        return 1;
        }
        return 0;
    }

    return objects.sort( compare );

}