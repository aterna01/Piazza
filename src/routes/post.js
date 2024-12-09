const express = require('express');
const { insertOne, find, replaceOne } = require('../dbManager');
const {validateNewPost, validatePostInteraction, validateGetPost} = require("../schema")
const {getSecondsSinceTime, compare} = require("../helpers")
const {verifyJWT} =require("../jwt")
const postRouter = express.Router();

postRouter.post("/create", verifyJWT, validateNewPost, async (req, res) => {
  try {
    const post = {
      "title": req.body.title,
      "topic": req.body.topic,
      "timestamp": new Date().toISOString(),
      "message": req.body.message,
      "expirationTime": 300,
      "status": "Live",
      "owner": req.body.owner,
      "interactions": [],
      "totalLikes": 0,
      "totalDislikes": 0
    }
  
    await insertOne("posts", post)
  
    return res.status(200).send({"Message": `The new post was successfully created by ${req.body.owner}`});
  } catch(_err) {
    return res.status(500).send({"Error": "An internal error occurred, please try again later"}) 
  }
})


postRouter.post("/interact", verifyJWT, validatePostInteraction, async (req, res) => {
  try {
    const {title, like, dislike, comment} = req.body
    const {email} = req.user

    const searchQuery = {title}

    console.log("msg dataaa: ", title, like, dislike, comment)
    console.log("decoded token userrrrrr: ", email)
    const dbPost = (await find("posts", searchQuery))[0]
    console.log("dbPostttttt: ", dbPost)
    if(!dbPost) {
      return res.status(404).send({"Error": `The post with provided title ${title} does not exist`})
    }

    if(dbPost.status === "Expired") {
      return res.status(404).send({"Error": "The status of a post is expired so you can not comment, like or dislike it"}) 
    }

    if(email === dbPost.owner && (like || dislike)) {
      return res.status(404).send({"Error": "The owner of a post can not like or dislike his own post"}) 
    }


    const secondsSinceCreated = getSecondsSinceTime(dbPost.timestamp)

    if(secondsSinceCreated > dbPost.expirationTime) {
      dbPost.status = "Expired"
      await replaceOne("posts", searchQuery, dbPost)
      return res.status(404).send({"Error": "The post is expired so it can not be updated"}) 
    }

    const interaction = {
       ...{email},
      // write only values that are not undefined
      ...(like !== undefined && {like}),
      ...(dislike !== undefined && {dislike}),
      ...(comment !== undefined && {comment}),
      "timestamp": new Date().toISOString()
    }

    console.log("interactionnnn: ", interaction)


    dbPost.interactions.push(interaction)
    // set to 0 if value is negative
    dbPost.expirationTime = dbPost.expirationTime - secondsSinceCreated < 0 ? 0 : dbPost.expirationTime - secondsSinceCreated


    // TO DO: if a user "likes" and then "dislikes" the first operation needs to be removed from totalCount.
    // This needs to work for both operations
    dbPost.totalLikes = like ? dbPost.totalLikes += 1 : dbPost.totalLikes
    dbPost.totalDislikes = dislike ? dbPost.totalDislikes += 1 : dbPost.totalDislikes


    console.log("dbPost updatedddd: ", dbPost)
  
    await replaceOne("posts", searchQuery, dbPost)
  
    return res.status(200).send({"Message": `The new post was interacted by ${email}`});
  } catch(err) {
    console.error("Error during interaction with a post: ", err)
    return res.status(500).send({"Error": "An internal error occurred, please try again later"}) 
  }
})

postRouter.get("/get", verifyJWT, validateGetPost, async (req, res) => {  //search by topic, search by topic & topic.status, search for an active post with highest interest(maximum number of likes and dislikes)
  console.log("call to /get: ", req.query)
  const {topic, status, highestInterest} = req.query;

  let postsToReturn = []

  const searchQuery = {
    ...(topic && {topic}),
    ...(status && {status})
  }



  console.log("searchQuery: ", searchQuery)

  const dbPosts = await find("posts", searchQuery)

  console.log("dbPostsssss: ", dbPosts)

  if(highestInterest) {
    dbPosts.sort(compare);
    postsToReturn = dbPosts[0] ? dbPosts[0] : []  // if dbPosts is [] then assign to []
  } else {
    postsToReturn = dbPosts
  }
  
 


  res.status(200).send({"Posts": postsToReturn})

})

module.exports = {postRouter}
