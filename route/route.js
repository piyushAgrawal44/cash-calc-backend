import express from "express";
import { welcome } from "../controller/welcome_controller.js";
import { registerUser,loginUser,userDetail,resetPassword,verifyToken,sendWelcomeMessage } from "../controller/user_controller.js";
import {newTransaction ,todayTransactionDetail,filterTransaction } from "../controller/transaction_controller.js";
import { body } from "express-validator";
import {decode_user} from '../middleware/decode_user.js';

const route=express.Router();

// routes for user
route.get('/', welcome);
route.get('/profile',decode_user, userDetail);

route.post('/register',[
    body('name','Please enter a valid name with atleast 3 digits').isLength({min:3}),
    body('email','Please enter a valid email').isEmail(),
    body('password','Please enter a valid password with atleast 6 digits').isLength({min:6})
], registerUser);

route.post('/login',[
    body('email','Please enter a valid email').isEmail(),
    body('password','Please enter a valid password with atleast 6 digits').isLength({min:6})
], loginUser);

route.post('/resetpassword',[
    body('email','Please enter a valid email').isEmail(),
], resetPassword);


route.post('/verifytoken',[
    body('email','Please enter a valid email').isEmail(),
    body('reset_token','Please enter a valid token').isLength({min:3}),
    body('password','Please enter a valid password with atleast 6 digits').isLength({min:6})

], verifyToken);


route.get('/sendwelcomemessage',sendWelcomeMessage);
// end of user routes

// routes for transaction
route.get('/transaction/todaytransaction',decode_user, todayTransactionDetail);
route.get('/transaction/filtertransaction',decode_user, filterTransaction);
route.post('/transaction/newtransaction',[
    body('amount','Please enter a amount >0 ').isLength({min:1}),
    body('type','Please enter a valid type').isLength({min: 3}),
],decode_user, newTransaction);

export {route};