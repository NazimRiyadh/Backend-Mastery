const express= require("express")
const connectDb= require("./db/db")
const multer= require("multer")
const uploadFile= require("./services/storage.service")
const postModel= require("./models/post.model")

const app= express()


connectDb()

app.use(express.json())

const upload= multer({storage: multer.memoryStorage()})

app.post("/",upload.single("image"),async (req, res)=>{
    const response= await uploadFile(req.file.buffer)
    const post= new postModel({
        image: response.url,
        caption: req.body.caption
    })
    await post.save()
    res.send("Post Created")
})

app.get("/",async (req, res)=>{
    const posts= await postModel.find()
    res.json(posts)
})

module.exports=app

