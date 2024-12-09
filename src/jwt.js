const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()


async function generateJWT(payload) {
  return new Promise((resolve, reject) => {
    // jsonwebtoken.sign(payload, process.env.JWT_SECRET, {"expiresIn": "1h"}, (err, token) => {
      console.log("process.env.JWT_SECRET in generateJWT: ", process.env.JWT_SECRET)
      jsonwebtoken.sign(payload, process.env.JWT_SECRET, (err, token) => {

      if(err) {
        return reject(err);
      }
      resolve(token);
    })
  })
}

async function verifyJWT(req, res, next) {
  const jwtToken = req.headers["authorization"]

  if (!jwtToken) {
    return res.status(401).send({"Message": "authorization token not provided"})
  }

  try {
    const decodedToken = await new Promise((resolve, reject) => {    
      console.log("process.env.JWT_SECRET in verifyJWT: ", process.env.JWT_SECRET)

      jsonwebtoken.verify(jwtToken, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.log("eeeer in verify tokennnnnnn: ", err)
          return reject(err);
        }
        resolve(decodedToken);
      })
    })
  
    req.user = decodedToken
    next()
  } catch(err) {
    console.error("JWT verification error:", err);
    return res.status(401).send({"Message": "Invalid or expired token."})
  }
  
}

module.exports = {
  generateJWT,
  verifyJWT
}