const http = require("http");

const server = http.createServer((req, res) => {
    const url = req.url;
    console.log(url);
    if (url === "/") {
        res.write("Home page");
        res.end();
    }
    else if (url === "/about") {
        res.write("About page");
        res.end();
    }
    else {
        res.write("404 page not found");
        res.end();
    }
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
