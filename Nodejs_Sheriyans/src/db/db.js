const mongoose= require("mongoose")


async function connectDb(params) {
    await mongoose.connect("mongodb+srv://backend_complete:password_backend@backendcluster.hiumws9.mongodb.net/")
}