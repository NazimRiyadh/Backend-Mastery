const mongoose= require("mongoose")

async function connectDb() {
    if(await mongoose.connect("mongodb+srv://backend_complete:password_backend@backendcluster.hiumws9.mongodb.net/insta_posts")){
        console.log("connected to DB")
    }
    else
    {
        console.log("Database Connection Failed!")
    }
}

module.exports=connectDb