import mongoose from 'mongoose';

import Binance from 'node-binance-api'
import {appConfig, sleep, Tracker} from '../utils.js';

import CompilerQueue from '../models/compilerQueue.js';
import User from '../models/user.js';
import Order from '../models/order.js';
import Processes from '../models/Processes.js';

export const compileHistoricTrades = async (req, res)=> {

    const data = req.body;
    const idUser = data.idUser;

    const binance = new Binance().options({
        APIKEY: data.apiKey,
        APISECRET: data.secretKey
    });

    let exchangeInfo = await binance.exchangeInfo().catch(error=>console.log('errorsito: ', error));
    exchangeInfo = exchangeInfo.symbols
    let symbols = []
    for(let i in exchangeInfo){
        symbols.push({symbol: exchangeInfo[i].symbol, baseAsset: exchangeInfo[i].baseAsset, quoteAsset: exchangeInfo[i].quoteAsset})
    }

    let counter = 0

    let allTrades = []

    for(let s in symbols){
        let sym = symbols[s].symbol

        if(s < 51){
            console.log('s: ', s, ', alltrades length: ', allTrades.length)
        }

        binance.trades(sym, (error, trades, symbol) => {
            if(error){
               process.exit()
            }

            counter +=1

            trades = trades.map(t => ({...t, tradeCoin: symbols[s].baseAsset, baseCoin: symbols[s].quoteAsset, idUser, broker:{id: t.id, orderId: t.orderId, orderListId: t.orderListId, isMaker: t.isMaker, isBestMatch: t.isBestMatch}}))

            allTrades.push(...trades)

            // if(s == (symbols.length -1 )){
            if(s == 50){
                let orders = allTrades.sort(function(a, b){
                    return b.time-a.time
                })

                console.log('insertamos las orders :)')
                Order.insertMany(orders).then(()=>{
                    console.log('insercion de orders finalizada')
                    
                    // Calculamos el performance
                    console.log('disparamos caluclatePerformance')
                    calculatePerformance(req,res,orders)
                    
                    console.log('updateamos Processes')
                    Processes.findOneAndUpdate({}, {compiler: {running: false}}, {new: true}).then((updated)=>{
                        console.log('Updated process: ', updated)
                        
                    }).then(()=>{
                        
                        // Actualizamos el compiler queue
                        console.log('updateamos el status del compilerqueue item')
                        CompilerQueue.findOneAndUpdate({user: idUser}, {status: 1}).then(()=> console.log('Compiler queue actualizado'))

                    })

                })
            }
            
        });

        await sleep(700)

    }

}

export const compileAssetAllocation = async (req, res) => {

    const data = req.body;
    console.log('data: ', data)
    const idUser = data.idUser;
    
    const binance = new Binance().options({
        APIKEY: data.apiKey,
        APISECRET: data.secretKey
    });

    var holding = []
    var totalBalance = null
    
    let ticker = await binance.prices();

    try{
        let balances = await binance.balance();

        let keys = Object.keys(balances)

        for(let i = 0; i<keys.length; i++){
            let balance = balances[keys[i]]

            if(parseFloat(balance.available)>0){

                let price_in_usdt = ticker[keys[i]+"USDT"]
                let balance_to_usdt = parseFloat(balance.available) * parseFloat(price_in_usdt)

                totalBalance === null ? totalBalance = balance_to_usdt : totalBalance += balance_to_usdt
            
                holding.push({coin: [keys[i]][0], ...balance, inUsdt: balance_to_usdt.toFixed(2)})                     
                
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

        console.log('holding: ', holding)

        let updatedUser = await User.findOneAndUpdate({_id: idUser}, {assetAllocation:holding}, {new: true})
        console.log('updated user :', updatedUser)
        return updatedUser

    }catch(error){
        console.log(error)
    }

}

export const calculatePerformance = async (req, res, orders=null) => {

    const idUser = req.body.idUser

    if(orders === null){

        // getOrders

    }

    // Traemos las orders agrupadas por symbol
    let orders_in_symbols = await Order.aggregate([
        {
            $group: {
                _id: "$symbol",
                obj: { $push: { symbol: "$symbol", baseCoin: "$baseCoin", price: "$price", qty: "$qty", quoteQty: "$quoteQty", isBuyer: "$isBuyer", time: "$time" } }
            }
        },
    ])

    console.log('orders in symbls: ', orders_in_symbols[0])

    let orders_by_symbol = []

    for (let os in orders_in_symbols){

        let symbol_w_orders = orders_in_symbols[os]
        orders_by_symbol.push(symbol_w_orders.obj)

    }

    var dataPoints = []
    let minDates = {}

    //  Creando el array de dataPoints
    for(let s in orders_by_symbol){

        let orders = orders_by_symbol[s]
        
        if(orders.length > 0){
            let tracker = new Tracker(orders[0].tradeCoin, orders[0].baseCoin)

            for(let o in orders){
                
                let order = orders[o]
                tracker.newOrder(order, o)
                
                // Seteando la fecha minima
                if(minDates[order.baseCoin] === undefined ){
                    minDates[order.baseCoin] = order.time
                }else{
                    if(minDates[order.baseCoin] > order.time){
                        minDates[order.baseCoin] = order.time
                    }
                }

                console.log('mindatres: ', minDates)

                if(!dataPoints[order.baseCoin]){
                    dataPoints[order.baseCoin] = []
                }

                if(!dataPoints[order.baseCoin][order.symbol]){
                    dataPoints[order.baseCoin][order.symbol] = []
                }

                dataPoints[order.baseCoin][order.symbol].push(tracker.snapshot)
            }
        }

    }

    console.log('dataPoints: ', dataPoints)

    let performanceScores = []

    for(let d in dataPoints){

        let baseCoin = dataPoints[d]
        let cumInvested = 0
        let baseCoinReturn = 0

        // Primero iteramos los simbolos para saber cual es el total invertido en ese baseCoin y poder calcular los weights de cada symbol
        for(let b in baseCoin){

            let symbol = baseCoin[b]
            let lastDataPoint = symbol[symbol.length - 1]
            cumInvested += lastDataPoint.netDeposits

        }

        console.log('CUM INVESTED DE ', d, '! ', cumInvested)

        // Ahora ya podemos sacar los weights del return de cada symbol
        for(let b in baseCoin){

            let symbol = baseCoin[b]
            let lastDataPoint = symbol[symbol.length - 1]

            let weight = lastDataPoint.netDeposits / cumInvested
            let weightedReturn = weight * (lastDataPoint.MWR / 100)
            baseCoinReturn += weightedReturn

        }

        console.log('return de ', d, ': ', baseCoinReturn)

        performanceScores.push({baseCoin: d, return: baseCoinReturn, started: minDates[d], lastUpdated: Date.now()})
        // performanceScores[d]["baseCoinAverage"] =  baseCoinAverage
        // performanceScores[d]["cumProfit"] =  cumProfit

    }

    console.log('iduser: ', idUser)

    console.log('Performance scoreses: ', performanceScores)
    let updatedUser = await User.findByIdAndUpdate(idUser, {performance: performanceScores}, {new:true})
    console.log('updated user con performance: ', updatedUser)


}

export const compile = async (req, res) =>{

    const data = req.body;

    // Consultamos el compiler Queue. Si hay un nuevo item con status en 0, seguimos

        // Consultamos los processes. Si compiler tiene running: false, seguimos
            
    compileAssetAllocation(req,res)

    Processes.findOneAndUpdate({}, {compiler: {running: true, startedAt: new Date(), idUser: data.idUser}}, {new: true}).then((updated)=>{
        console.log('Updated process: ', updated)
    }).then(()=>{
        
        compileHistoricTrades(req, res).then((res)=>{
            console.log('compileHistoricTrades finished!')
        })
    
    })

}
