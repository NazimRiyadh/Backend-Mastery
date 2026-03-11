const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
    uri:{
        type: String,
        required: true,
    },
    cover_image:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    artist:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
})

const MusicModel = mongoose.model("Music", musicSchema);
module.exports = MusicModel;