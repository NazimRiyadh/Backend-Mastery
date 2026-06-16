import app from "./app.js";
import Database from "./config/database.js";
import { config } from "./config/index.js";


const startServer=async()=>{
    try {
        await Database.connect();
        app.listen(config.port,()=>{
            console.log(`Server is running on port ${config.port}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

startServer();