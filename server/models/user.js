import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    description: String,
    baseCoin: String,
    assetAllocation: [{
        coin: String,
        available: Number,
        onOrder: Number,
        inUsdt: Number,
        percentage: Number,
        dataPoints: []
    }],
    performance: [{
        baseCoin: String,
        return: Number,
        lastUpdated: Date,
        started: Date,
        dataPoints: []
    }],
    keys: Object,
    dateCreated: {
        type: Date,
        default: new Date()
    }

})

const User = mongoose.model('Users', userSchema);

export default User;