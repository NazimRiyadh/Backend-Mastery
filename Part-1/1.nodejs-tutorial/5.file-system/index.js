const fs = require("fs");
const path = require("path");

//creating folder
const dataFolder = path.join(__dirname, "data")
if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder)
    console.log("data folder created")
}
else {
    console.log("data folder already exists")
}

//creating file
const filePath = path.join(dataFolder, "user.txt")
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "Hello world")
    console.log("file created")
}
else {
    console.log("file already exists")
}

//reading from file
const readFromFile = fs.readFileSync(filePath, "utf-8")
console.log("file content: ", readFromFile)

//appending to file
fs.appendFileSync(filePath, "\nNew Line Added")
console.log("file content after appending: ", fs.readFileSync(filePath, "utf-8"))

//async way of creating file
const asyncPath = path.join(dataFolder, "user2.txt")
fs.writeFile(asyncPath, "Hello world", (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("file created")
    }
})
console.log("async file created")

//some code remaining of async file 