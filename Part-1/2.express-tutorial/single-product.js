const express = require("express");
const app = express();

const products = [
    {
        id: 1,
        name: "Product 1",
        price: 100
    },
    {
        id: 2,
        name: "Product 2",
        price: 200
    },
    {
        id: 3,
        name: "Product 3",
        price: 300
    }
]

app.get('/', (req, res) => {
    res.send("This is Express.js")
})

app.get('/products', (req, res) => {
    res.json(products)
})

app.get('/products/:id', (req, res) => {
    const productId = req.params.id
    const product = products.find((product) => product.id === parseInt(productId))
    res.json(product)
})

app.listen(2000, () => {
    console.log("Server running on port 2000")
})
