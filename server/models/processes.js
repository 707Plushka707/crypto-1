import mongoose from 'mongoose';

const compiler = mongoose.Schema({
    running: Boolean,
    startedAt: Date,
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
})

const processesSchema = mongoose.Schema({

    compiler,

})

const Processes = mongoose.model('Processes', processesSchema);

export default Processes;