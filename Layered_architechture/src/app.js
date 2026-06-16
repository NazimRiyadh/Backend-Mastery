import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { config } from "./config/index.js";
import indexRoutes from "./routes/index.routes.js";
const app= express();

const port= config.port || 3000;

app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods:["GET","POST","PUT","DELETE","OPTIONS"],
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/v1", indexRoutes);

app.get(config.api.prefix + config.api.version + "/",(req, res)=>{
    res.json({message:"Welcome to the API"});
});

export default app;