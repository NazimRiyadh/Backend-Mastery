console.log("node module wrapper demo")

console.log("directory name in wrapper explorer", __dirname)
console.log("file name in wrapper explorer", __filename)

module.exports.greet = function (name) {
    console.log("hello", name)
}
