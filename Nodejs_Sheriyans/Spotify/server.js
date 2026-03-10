const app = require("./src/app");
const dotenv = require("dotenv");
dotenv.config();

port = process.env.PORT;
app.listen(port || 3000, () => {
  console.log(`Server Started on Port: ${port}`);
});
