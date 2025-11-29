const express = require("express");
const app = express()
app.get('/', (req, res) => {
    res.send("This is Express.js")
})
const PORT = 2000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
