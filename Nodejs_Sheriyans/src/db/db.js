const mongoose= require("mongoose")


async function connectDb(params) {
    await mongoose.connect()
}