import mongoose from "mongoose";
const resetPasswordSchema = mongoose.Schema({
    user_email: {
        type: String,
        required: true,
    },
   
    reset_token: {
        type: String,
        required: true,
    },
    created_at:{
        type: Date,
        required: true,
        default: Date()
    }
});

const reset_token = mongoose.model('reset_token', resetPasswordSchema);

export default reset_token;