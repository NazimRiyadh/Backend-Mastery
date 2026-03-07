const mongoose= require("mongoose")


async function connectDb() {
    if(await mongoose.connect("mongodb+srv://backend_complete:password_backend@backendcluster.hiumws9.mongodb.net/notes")){
    console.log("Connected to MongoDB")}
}

module.exports=connectDb