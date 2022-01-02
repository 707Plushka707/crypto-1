import express from 'express';
import Binance from 'node-binance-api'
import {appConfig, sleep} from '../utils.js';

import fs, { existsSync } from 'fs';

import { sample_orders } from '../sample_orders.js';

const router = express.Router()

// const Binance = require('node-binance-api');
const binance = new Binance().options({
    APIKEY: '6Cwc15LmXUmSTDDLr2jiHTW9aCMv6Hwl2pzHHcae9rPQnRMIcbs1CNOz6riOcdRq',
    APISECRET: 'Gku17cNviBCLyeA23efFesrP5sIK2iir9luSiyQAFdQIGwGwEfamHJaK0uTeWsfl'
});


export const prueba = async () => {

    // Funcion "getAssetAllocation"
    async function getAssetAllocation (){

        var holding = []
        var totalBalance = null
        
        let ticker = await binance.prices();

        await binance.balance((error, balances) => {
            if ( error ) return console.error(error);

            let keys = Object.keys(balances)

            for(let i = 0; i<keys.length; i++){
                let balance = balances[keys[i]]

                if(parseFloat(balance.available)>0){

                    let price_in_usdt = ticker[keys[i]+"USDT"]
                    let balance_to_usdt = parseFloat(balance.available) * parseFloat(price_in_usdt)

                    totalBalance === null ? totalBalance = balance_to_usdt : totalBalance += balance_to_usdt
                
                    holding.push({coin: [keys[i]], ...balance, inUsdt: balance_to_usdt.toFixed(2)})                     
                    
                }
            }

            // Teniendo el total balance, filtramos los assets que representan menos de un 0.5%
            for(let i = 0; i <holding.length; i++){
                let perc = (parseFloat(holding[i].inUsdt) * 100) / parseFloat(totalBalance)
                holding[i].percentage = perc.toFixed(2)
            }
            
            for(let i = 0; i<holding.length; i++){
                if(parseFloat(holding[i].percentage) < appConfig.minimumAssetPercentage){
                    holding.splice(i, 1)
                    // Restamos el valor de i ya que se hizo un splice
                    i--
                }
                
            }

            console.log(holding, totalBalance)
        });


        binance.trades((error, trades, symbol) => {
            if ( error ) return console.error(error);
            console.info(symbol+" trade history", trades);
          });


        return {holding, totalBalance}

    }

    async function getHistoricTrades(){

        let exchangeInfo = await binance.exchangeInfo().catch(error=>console.log('errorsito: ', error));
        exchangeInfo = exchangeInfo.symbols
        let symbols = []
        // console.log('type: ', typeof exchangeInfo)
        for(let i in exchangeInfo){
            // console.log('ex: ', exchangeInfo[i])
            symbols.push({symbol: exchangeInfo[i].symbol, baseAsset: exchangeInfo[i].baseAsset, quoteAsset: exchangeInfo[i].quoteAsset})
        }

        // let symbols = Object.keys(ticker)
        console.log('s: ', symbols)

        let counter = 0

        let allTrades = []

        // return

        for(let s in symbols){
            let sym = symbols[s].symbol

            binance.trades(sym, (error, trades, symbol) => {
                if(error){
                   console.log('Hubo un error: ', error)
                   process.exit()
                }

                console.info("count " + s + " - " + symbol+" trade history", trades);
                counter +=1
                console.log('COUNTER: ', counter)

                trades = trades.map(t => ({...t, tradeCoin: symbols[s].baseAsset, baseCoin: symbols[s].quoteAsset}))

                // allTrades.push(...trades)
                allTrades.push(trades)

                // console.log('ALLTRADES: ', allTrades)

                console.log('S: ', s)

                if(s == (symbols.length -1 )){
                    console.log('Last iteration, guardamos!', symbols[s+1])
                    var json = JSON.stringify(allTrades);
                    fs.writeFile('historicTrades2.json', json, 'utf8', ()=>console.log('listo!'));
                }
                
            });

            await sleep(700)

        }

    }

    async function getDepositHistory(){

        let params = {startTime: "1514764800000"}

        binance.depositHistory((error, response) => {
            console.info(response);
          }, params);

        binance.withdrawHistory((error, response) => {
            console.info(response);
          });

        binance.depositAddress("XMR", (error, response) => {
            console.log(response);
          });

    }

    await getHistoricTrades()
    


    // getDepositHistory()

}

router.get('/', prueba)

export default router