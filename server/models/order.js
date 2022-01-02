import mongoose from 'mongoose';

const ordersSchema = mongoose.Schema({
    symbol: String,
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    // En broker van identificadores relacionados al broker: "id", "orderId", "orderListId", "isMaker", "isBestMatch"
    broker: Object,
    price: Number,
    qty: Number,
    quoteQty: Number,
    commission: Number,
    commissionAsset: String,
    time: Number,
    
    // Tiempo en unix de cuando se creó la orden
    time: Number,
    isBuyer: Boolean,
    tradeCoin: String,
    baseCoin: String,
    dateCreated: {
        type: Date,
        default: new Date()
    }

})

const OrderSchema = mongoose.model('Orders', ordersSchema);

export default OrderSchema;