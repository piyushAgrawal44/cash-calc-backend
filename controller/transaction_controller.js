import Transactions from '../modal/transaction_schema.js';
import { validationResult } from "express-validator";


// end point for new transaction by POST request /transaction/newtransaction
export const newTransaction = async (req, res) => {

    // checking if there any error like short password or wrong email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Please fill all the required details correctly !", errors: errors.array() });
    }
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${year}-${month<10?"0"+month:month}-${day<10?"0"+day:day}`;

    try {
        // creating the new user in mongo db
        Transactions.create({
            amount: req.body.amount,
            type: req.body.type,
            note: req.body.note,
            user_id: req.user.id,
            created_at: currentDate
        }).then(transactions => {
            return res.status(201).json({ success: true, message: "Successfully saved !" });
        }).catch(error => {
            return res.status(501).json({ success: false, message: "Internal Server Error", long_message: error.message });
        });

    } catch (error) {
        return res.status(501).json({ success: false, message: "Inernal Server Error", long_message: error.message })
    }
};

// end point for new transaction by POST request /transaction/newtransaction
export const todayTransactionDetail = async (req, res) => {

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${year}-${month<10?"0"+month:month}-${day<10?"0"+day:day}`;


    try {
        // creating the new user in mongo db
        const transactions = await Transactions.find({ created_at: currentDate, user_id: req.user.id });
        return res.status(201).json({ success: true, data: transactions });
    } catch (error) {
        return res.status(501).json({ success: false, message: "Inernal Server Error", long_message: error.message })
    }
};

// end point for getting list of all the  articles with filter using GET request
export const filterTransaction = (async (req, res) => {
    let start_date = req.query.start_date;
    let end_date = req.query.end_date;

    let filter = {};
    filter.user_id=req.user.id;
    if (start_date) {
        filter.created_at = {$gte: start_date};
    }
    if (filter.created_at) {
        if (end_date) {
            filter.created_at = {...filter.created_at,$lte: end_date};
        } 
    }
    else{
        if (end_date) {
            filter.created_at = {$lte: end_date};
        }
    }

    try {

        const transactions = await Transactions.find(filter);
        res.status(201).json({success:true, data:transactions});

    } catch (error) {
        res.status(501).json({ success:false,message:"Internal Server Error !",long_message: error.message })

    }
});