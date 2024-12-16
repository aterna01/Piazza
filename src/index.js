const express = require('express')
const {authRouter} = require("./routes/auth")
const {postRouter} = require("./routes/post")


const app = express()
app.use(express.json());

app.use("/user", authRouter)
app.use("/post", postRouter)

app.get('/', function (req, res) {
  res.status(200).send({"Message": "Hello, this is the Piazza API"});

})

const server = app.listen(3000, () => {
  console.log('Server is up and running on port 3000');
});


module.exports = server
