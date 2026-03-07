const mongoose= require("mongoose")


const noteScheema= new mongoose.Schema({
    title: String,
    description: String,
})

const model=mongoose.model("note", noteScheema)

module.exports=model