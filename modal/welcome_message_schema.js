import mongoose from "mongoose";
const welcomeMessage = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        created_at: {
            type: Date,
            required: true,
            default: Date()
        }
    },

});

const welcome_message = mongoose.model('welcome_message', welcomeMessage);

export default welcome_message;