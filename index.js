import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import bodyParser from 'body-parser';
import { route } from "./route/route.js";

const app = express();
const PORT = process.env.PORT || 8000;

const url = "mongodb+srv://piyush:3EkGGELBAW0riN53@cluster0.ugknm.mongodb.net/cash-calc-dev?retryWrites=true&w=majority";
app.use((express.json()));
mongoose.set('strictQuery', true)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.use(bodyParser.json({ extended: true }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    // app.use(cors({origin:["http://localhost:3000","https://piyushAgrawal44.github.com/cash-calc/"]}));

    app.use('/', route);

    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    })
}).catch((error) => { console.log("error is: " + error.message) })
