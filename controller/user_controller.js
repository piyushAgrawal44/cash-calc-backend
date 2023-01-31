import User from '../modal/user_schema.js';
import PasswordReset from '../modal/password_reset_schema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from "express-validator";
import nodemailer from 'nodemailer';
import WelcomeMessage from '../modal/welcome_message_schema.js';


// Do not change this details before thinking... 
const privateKey = "piyu@sh@#@^&^1310";
const passwordCoriander = "#p1p@";
const adminEmail = "baniyajunction.official@gmail.com"
const adminEmaiPass = "vwsfopgxxuvwatiw";
// Do not change above code before thinking... 


// end point for User Sign Up by POST request /register
export const registerUser = async (req, res) => {

    // checking if there any error like short password or wrong email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Please fill all the required details correctly !", errors: errors.array() });
    }

    try {
        // checking for duplicate email id
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) {
            return res.status(200).json({ success: false, message: "Email id already registered !" });
        }
        // generating salt for secure password
        let salt = bcrypt.genSaltSync(10);
        let passwordWithCoriander = req.body.password + passwordCoriander;
        let hashPassword = bcrypt.hashSync(passwordWithCoriander, salt);

        // creating the new user in mongo db
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
        }).then(user => {
            let data = {
                user: {
                    id: user._id
                }
            }
            let token = jwt.sign(data, privateKey);

            return res.status(201).json({ success: true, token: token });
        }).catch(error => {
            return res.status(400).json({ success: false, message: error.message });
        });

    } catch (error) {
        return res.status(501).json({ success: false, message: "Inernal Server Error", long_message: error.message })
    }
};


// end point for User login by POST request /login
export const loginUser = async (req, res) => {

    // checking if there any error like short password or wrong email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ success: false, message: "Please fill all the required details correctly !", errors: errors.array() });
    }

    const email = req.body.email, password = req.body.password;
    try {

        // Findinh the user with requested email
        const userDetails = await User.findOne({ email: email });

        // if no user exist for requested email
        if (userDetails === null) {
            return res.status(200).send({
                success: false,
                message: "Invalid Credentials !"
            });
        }

        let passwordWithCoriander = password + passwordCoriander;

        const passwordMatch = await bcrypt.compare(passwordWithCoriander, userDetails.password);

        // if entered password is wrong
        if (!passwordMatch) {
            return res.status(201).send({
                success: false,
                message: "Invalid Credentials !"
            });
        }

        // successfully logged in
        let data = {
            user: {
                id: userDetails._id
            }
        }
        let token = jwt.sign(data, privateKey);
        return res.status(201).send({
            success: true,
            token: token
        })
    } catch (error) {
        return res.status(501).json({ success: false, message: "Inernal Server Error", long_message: error.message })
    }

};

// end point for getting Single User details using GET request
export const userDetail = (async (req, res) => {
    try {
        const userDetails = await User.findOne({ _id: req.user.id }).select({ name: 1, email: 1 });
        return res.status(200).json({ success: true, user: userDetails });
    } catch (error) {
        return res.status(501).json({ success: false, message: "Internal server error", long_message: error.message })
    }
});



// end point for Reset Password by POST request /resetpassword
export const resetPassword = async (req, res) => {

    // checking if there any error like short password or wrong email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Please fill all the required details correctly !", errors: errors.array() });
    }

    try {
        let email = req.body.email;
        const userDetails = await User.findOne({ email: email });

        // if no user exist for requested email
        if (userDetails === null) {
            return res.status(200).send({
                success: false,
                message: "Invalid Email !"
            });
        }

        let random_token = Math.floor(1000 + Math.random() * 9000);
        req.subject = "Password Reset Token !";
        req.text = "Your passsword reset token is " + random_token;

        let mailSender = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: "baniyajunction.official@gmail.com",
                pass: "vwsfopgxxuvwatiw"
            }
        });
        let mailOptions = {
            from: "baniyajunction.official@gmail.com",
            to: req.body.email,
            subject: req.subject,
            text: req.text
        }
        mailSender.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(501).json({ success: false, message: error.message, error: error });
            }
        })
        // creating the reset token in mongo db
        PasswordReset.create({
            user_email: req.body.email,
            reset_token: random_token,
        }).then(reset_token => {
            return res.status(201).json({ success: true, message: "Successfully mailed the reset token on requested email !" });
        }).catch(error => {
            return res.status(400).json({ success: false, message: error.message });
        });


    } catch (error) {
        return res.status(501).json({ success: false, message: "Inernal Server Error", long_message: error.message })
    }
};


// end point for Reset Password by POST request /resetpassword
export const verifyToken = async (req, res) => {

    // checking if there any error like short password or wrong email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Please fill all the required details correctly !", errors: errors.array() });
    }

    try {
        let email = req.body.email;

        const passwordResetDetails = await PasswordReset.findOne({ email: email, reset_token: req.body.reset_token });

        // if no user exist for requested email
        if (passwordResetDetails === null) {
            return res.status(200).send({
                success: false,
                message: "Please check email id or token !"
            });
        }

        if (passwordResetDetails.reset_token !== req.body.reset_token) {
            return res.status(200).send({
                success: false,
                message: "Please check email id or token !"
            });
        }

        let salt = bcrypt.genSaltSync(10);
        let passwordWithCoriander = req.body.password + passwordCoriander;
        let hashPassword = bcrypt.hashSync(passwordWithCoriander, salt);

        // creating the reset token in mongo db
        User.updateOne({ "email": email },
            {
                $set: { "password": hashPassword }
            }).then(user => {
                return res.status(201).json({ success: true, message: "Successfully password updated !" });
            }).catch(error => {
                return res.status(501).json({ success: false, message: "Internal Server Erorr", long_message: error.message });
            });

    } catch (error) {
        return res.status(501).json({ success: false, message: "Inernal Server Error", long_message: error.message })
    }
};

// end point for Reset Password by POST request /resetpassword
export const sendWelcomeMessage = async (req, res) => {

    // checking if there any error like short password or wrong email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Please fill all the required details correctly !", errors: errors.array() });
    }

    try {

        const userList = await User.find();

        // if no user exist for requested email
        if (userList === null) {
            return res.status(200).send({
                success: false,
                message: "No user found !"
            });
        }
       
        for (let i = 0; i < userList.length; i++) {
            const element = userList[i];

            // checking if welcome message already send
            const userExist = await WelcomeMessage.findOne({ user_id: element._id });

            if (!userExist) {
                WelcomeMessage.create({
                    user_id: element._id,
                }).then(data => {
                    try {
                        let mailMesssage = "Hello " + element.name + " ! We're glad to see you on <b>Cash Calc - A expense tracker</b>.<br><br> We hope now you will be able to manage your expenses more nicely. We recommend you to start tracking your expenses from today only : <a href='https://piyushagrawal44.github.io/cash-calc/'><b>Start Now</b></a> <br><br> Thank You for using <b>Cash Calc</b> <br><br> For any feedback or suggestions kindly mail us @ baniyajunction.official@gmail.com";
                        sendMail(element.email, "Successfully account created !", mailMesssage);
                    } catch (error) {
                        WelcomeMessage.deleteOne({ _id: data._id });
                    }
                });
            }
            
            
        }

        res.status(201).json({ success: true, message: "Successfully welcome message send !" });

    } catch (error) {
        return res.status(501).json({ success: false, message: "Inernal Server Error", long_message: error.message })
    }
};

const sendMail = (userEmail, subject, message) => {
    let mailSender = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: adminEmail,
            pass: adminEmaiPass
        }
    });
    let mailOptions = {
        from: adminEmail,
        to: userEmail,
        subject: subject,
        html: message
    }
    mailSender.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(501).json({ success: false, message: error.message, error: error });
        }
    })
}