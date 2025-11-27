const path = require("path");
console.log(path.dirname(__filename))//directory name
console.log(path.basename(__filename))//file name
console.log(path.extname(__filename))//extension name

const joinpath = path.join("/content", "files", "index.js")
console.log(joinpath)

const resolvePath = path.resolve(__dirname, "content", "files", "index.js")
console.log("resolved path", resolvePath)

const normalizePath = path.normalize("/content//files/index.js")
console.log("normalized path", normalizePath)