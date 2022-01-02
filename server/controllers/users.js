import mongoose from 'mongoose';

import Binance from 'node-binance-api'

import User from '../models/user.js';
import Order from '../models/order.js';
import CompilerQueue from '../models/compilerQueue.js';

import { compileAssetAllocation } from './compiler.js';

export const getUsers = async (req, res)=>{

    console.log('getUsers controlador')
    let users = await User.find().select({username:1})

    console.log('users obj retrieved: ', users)

    try{
        res.status(201).json(users)
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const setApiKeys = async (req, res) =>{

    const data = req.body;

    // Seteamos las apiKeys en User
    var user = await User.findOneAndUpdate({_id: data.idUser}, {keys: {apiKey: data.apiKey, secretKey: data.secretKey}}, {new: true})
    
    // Instanciamos la clase binance con las keys
    const binance = new Binance().options({
        APIKEY: data.apiKey,
        APISECRET: data.secretKey
    });

    // Obtenemos el asset allocation de ese usuario
    compileAssetAllocation(binance, data.idUser).then((user)=>{
        console.log('compileAssetAllocation finished: ', user)
    }).catch((error)=>console.log(error))
    
    // Creamos la hilera en el compiler_queue para ese user
    let compilerQueueItem = {user: data.idUser, status:0}
    let newCompilerQueueItem = new CompilerQueue(compilerQueueItem)

    try{
        await newCompilerQueueItem.save()
        console.log('compiler que added succesfully')
        res.status(201)
    }catch(error){
        res.status(409).json({message: error.message})
    }
}

export const getProfileData = async (req, res) =>{

    let username = req.params.username;

    let user = await User.find({username})
    user = user[0]

    console.log('ud: ', user)

    let profile = {id: user._id, name: user.name, email: user.email, username: user.username, description: user.description, assetAllocation: user.assetAllocation, performance: user.performance, baseCoin: user.baseCoin}

    try{
        res.status(201).json(profile)
    }catch(error){
        res.status(409).json({message: error.message})
    }
}

export const getTradeHistory = async (req, res) =>{

    const idUser = req.params.id
    const limit = req.params.limit

    let tradeHistory = await Order.find({idUser}).limit(limit).select('price baseCoin tradeCoin time quoteQty symbol -_id')

    console.log('tradehistory: ', tradeHistory)
    
    try{
        res.status(201).json(tradeHistory)
    }catch(error){
        res.status(409).json({message: error.message})
    }

}