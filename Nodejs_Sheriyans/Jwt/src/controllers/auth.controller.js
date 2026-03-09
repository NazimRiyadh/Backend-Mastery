const mongoose = require("mongoose");
const User = require("../models/user.model"); 
const jwt = require("jsonwebtoken");
const Post = require("../models/post.model");

async function register(req, res) {
    const { username, email, password } = req.body;
    let user;
    try {
        user = await User.create({
            username,
            email,
            password,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
    const token= jwt.sign({
                id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        })

    res.cookie("token", token);

    res.status(201).json({
        message: "User created",
        user,
        token,
    })
    
}

async function create_post(req, res) {
    const { title, content } = req.body;

    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }

    let post;
    try {
        post = await Post.create({
            title,
            content,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
    res.status(201).json({
        message: "Post created",
        post,
    })
}

module.exports = {
    register,
    create_post,
};
