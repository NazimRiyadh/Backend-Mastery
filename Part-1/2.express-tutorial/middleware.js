const express = require("express");
const app = express();

const middleware = (req, res, next) => {
    console.log("Middleware called");
    //next();
}

app.use(middleware);

app.get('/', (req, res) => {
    res.send("This is Express.js")
})

app.get('/about', (req, res) => {
    res.send("This is about page")
})

app.listen(2000, () => {
    console.log("Server running on port 2000")
})
