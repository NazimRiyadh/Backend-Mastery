const imageKit= require("@imagekit/nodejs")
const dotenv= require("dotenv").config()

const client= new imageKit({
    privateKey: process.env.IMAGEKIT_KEY
})

async function uploadFile(buffer) {
    const response= await client.files.upload({
        file: buffer.toString("base64"),
        fileName: "test"
    })
    return response
} 

module.exports= uploadFile
