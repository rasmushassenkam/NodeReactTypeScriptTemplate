import express, { Application } from "express";
import bodyParser from "body-parser";
import { TemplateRoutes } from "./routes/api/template";
import { constants } from "./config/constants";
import mongoose from "mongoose";
import { AuthRoutes } from "./routes/api/auth";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Bodyparser middleware
app.use(bodyParser.json());

// Cors middleware
//app.use(cors(corsOptions));

// Cookie parser middleware
app.use(cookieParser());

app.use(function (req, res, next) {
    res.header("Content-Type", "application/json;charset=UTF-8")
    res.header("Access-Control-Allow-Origin", ["http://localhost:3000"])
    res.header({ "Access-Control-Allow-Credentials": true })
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
    next();
});

app.listen(constants.PORT, () => {
    mongoose.connect(constants.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.log(err);
});

db.once("open", () => {
    //Routes
    app.use("/api/template", TemplateRoutes);
    app.use("/api/auth", AuthRoutes);
});