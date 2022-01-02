import mongoose from 'mongoose'

const compilerQueueSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    status: Number,
    dateCreated: {
        type: Date,
        default: new Date()
    }

})

const CompilerQueue = mongoose.model('CompilerQueues', compilerQueueSchema);

export default CompilerQueue;