const express= require('express')
const note= require("./models/note.model")
const app=express()

app.use(express.json())

app.post("/notes",async(req,res)=>{
    const data=req.body
    const newNote=await note.create(
        {title: data.title,
        description: data.description}
    )
    res.setHeader("Content-Type","application/json")
    res.send({message:"Note created successfully",note: newNote})
}) 


app.get("/notes",async(req,res)=>{
    const notes=await note.find()
    res.json({notes})
})

app.get("/notes/:id", async(req, res)=>{
    const id= req.params.id
    const single_note= await note.findById(id)
    res.json({single_note})

})

app.delete("/notes/:id", async(req, res)=>{
    const id= req.params.id
    const deleted_note= await note.findByIdAndDelete({
        _id:id
    })
    res.json({message:"Note deleted successfully"})
})

app.patch("/notes/:id", async(req, res)=>{
    const id= req.params.id
    const data= req.body
    const updated_note= await note.findByIdAndUpdate({
        _id:id
    },{
        title: data.title,
        description: data.description
    })
    res.json({message:"Note updated successfully",note: updated_note})
})
    

module.exports=app

