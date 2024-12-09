const Joi = require("joi")

const userSchema = Joi.object({
  "email": Joi.string().email().required(),
  "password": Joi.string().required()  // need to add regex validation
})

const newPostSchema = Joi.object({
  "title": Joi.string().required(),
  "topic": Joi.array().items(Joi.string().valid("Politics", "Health", "Sport", "Tech")).min(1).max(4).required(),
  "message": Joi.string().required(),
  "owner": Joi.string().email().required(),
})

const postInteractionSchema = Joi.object({
  "title": Joi.string().required(),
  "like": Joi.bool(),
  "dislike": Joi.bool(),
  "comment": Joi.string()
})
.nand("like", "dislike") // only one of these can be present at the same time
.min(2) // at least 2 items must be present, which means there can not be interaction on a post without like, dislike or comment 

const getPostSchema = Joi.object({
  //search by topic, search by topic & topic.status, search for an active post with highest interest(maximum number of likes and dislikes)
  "topic": Joi.array().items(Joi.string().valid("Politics", "Health", "Sport", "Tech")).min(1).max(4),
  "status": Joi.string().valid("Valid", "Expired"),
  "highestInterest": Joi.bool()
})
.min(1) // at least 1 item must be present

function validateUser(req, res, next) {
  const result = userSchema.validate(req.body);
  if (result.error) {
    return res.status(400).send({"Error":result.error.details})
  }

  console.log("req.body in validateData funccccc: ", req.body)

  next()
}

function validateNewPost(req, res, next) {
  const result =  newPostSchema.validate(req.body)
  if (result.error) {
    return res.status(400).send({"Error":result.error.details})
  }

  next()
}

function validatePostInteraction(req, res, next) {
  const result = postInteractionSchema.validate(req.body)
  if (result.error) {
    return res.status(400).send({"Error":result.error.details})
  }

  next()
}

function validateGetPost(req, res, next) {
  if (!Array.isArray(req.query.topic)) {
    req.query.topic = req.query.topic ? [req.query.topic] : [];
  }
  console.log("req.queryyyy: ", req.query)
  const result = getPostSchema.validate(req.query)
  if (result.error) {
    return res.status(400).send({"Error":result.error.details})
  }

  next()
}

module.exports = {validateUser, validateNewPost, validatePostInteraction, validateGetPost}
