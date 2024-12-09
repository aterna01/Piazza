const express = require('express')
const authRouter = express.Router()
const bcrypt = require('bcryptjs');

const {insertOne, find} =require("../dbManager")
const {validateUser} = require("../schema")
const {generateJWT} = require("../jwt")


authRouter.post("/register", validateUser, async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    const user = {
      "email": req.body.email,
      "password": await bcrypt.hash(req.body.password, 8)
    }

    await insertOne("users", user);
    return res.status(200).send({"Message": `The new user with email ${req.body.email} was successfully registered`});
  } catch(_err) {
    return res.status(500).send({"Error": "An internal error occurred, please try again later"}) 
  }
  
})


authRouter.post("/login", validateUser, async (req, res) => {
  try {
    console.log("req.body: ", req.body);

    const email = req.body.email;
    const password = req.body.password

    const dbRecord = (await find("users", {email}))[0]
    console.log("dbRecord: ", dbRecord)

    if (!dbRecord) {
      return res.status(401).send({"Error": "Invalid username or password."})
    }

    const isAuthenticated =  await bcrypt.compare(password, dbRecord.password)

    if(isAuthenticated) {
      try {
        const tokenPayload = { email: dbRecord.email, id: dbRecord.id };
        const authToken = await generateJWT(tokenPayload)
        return res.status(200).send({authToken})
      } catch(_err) {
        return res.status(500).send({"Error": "An internal error occurred, please try again later"})
      }
      
    } else {
      return res.status(401).send({"Error": "Invalid username or password."})
    }

  } catch(err) {
    console.error("Error during login: ", err)
    return res.status(500).send({"Error": "An internal error occurred, please try again later"}) 
  }

})

module.exports = {authRouter}
