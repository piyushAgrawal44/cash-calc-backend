import mongoose from "mongoose";
const transactionSchema = mongoose.Schema({
    amount: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    note: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    created_at:{
        type: String,
        required: true,
        default: Date()
    },
    updated_at:{
        type: String,
    }
});

const transaction = mongoose.model('transaction', transactionSchema);

export default transaction;