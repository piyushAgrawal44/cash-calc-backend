import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    created_at:{
        type: Date,
        required: true,
        default: Date()
    },
    updated_at:{
        type: Date,
    }
});

const user = mongoose.model('user', userSchema);

export default user;