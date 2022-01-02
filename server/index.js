import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import pruebas from './routes/pruebas.js'
import users from './routes/users.js'
import compiler from './routes/compiler.js'

import dotenv from 'dotenv';
dotenv.config()

const app = express();

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use('/pruebas', pruebas)
app.use('/users', users)
app.use('/compiler', compiler)


const PORT = process.env.PORT || 5000
const CONNECTION_URL = 'mongodb+srv://juanchaher:Jchskate12@cluster0.qfpo2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

// app.listen(PORT, ()=>console.log('Server running on port: ' + PORT))

mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> app.listen(PORT, ()=>console.log('Server running on port: ' + PORT)))
    .catch((error)=> console.log(error.message)) 

