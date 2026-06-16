import mongoose from "mongoose";

const toolSchema= new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Tool name is required"],
        trim: true,
        maxLength: [100, "Tool name cannot exceed more than 100 char"]
    },
    description:{
        type: String,
        required: [true, "Tool description is required"],
        trim: true,
        maxLength: [500, "Tool description cannot exceed more than 500 char"]
    },
    categrory:{
        type: String,
        required: [true, "Tool category is required"],
        enum: {
            values: [
                "API",
                "Data Analysis",
                "Machine Learning", ]},
    url:{
        type: String,
        required: [true , "Tool URL is required"]}
    }
})

toolSchema.index({categrory: 1})
toolSchema.index({name: 1})