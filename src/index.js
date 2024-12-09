const express = require('express')
const {authRouter} = require("./routes/auth")
const {postRouter} = require("./routes/post")


const app = express()
app.use(express.json());

app.use("/user", authRouter)
app.use("/post", postRouter)

app.get('/', function (req, res) {
  res.send('Hello World, this is test');

})

app.listen(3000)
