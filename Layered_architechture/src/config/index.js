import dotenv from "dotenv";
dotenv.config();
export const config={
    port:process.env.PORT,
    mongodb:{
        uri:process.env.MONGOOSE_URI,
    },
    api:{
        prefix:"/api",
        version: "/v1",
    },
    cors:{
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
    },
}