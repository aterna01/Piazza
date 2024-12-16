const Joi = require("joi")

const userSchema = Joi.object({
  "email": Joi.string().email().required(),
  "password": Joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/)).required()
  // Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be longer than 8 characters
}).required()

const newPostSchema = Joi.object({
  "title": Joi.string().required(),
  "topic": Joi.array().items(Joi.string().valid("Politics", "Health", "Sport", "Tech")).min(1).max(4).required(),
  "message": Joi.string().required(),
  "owner": Joi.string().email().required(),
}).required()

const postInteractionSchema = Joi.object({
  "title": Joi.string().required(),
  "like": Joi.bool(),
  "dislike": Joi.bool(),
  "comment": Joi.string()
})
.nand("like", "dislike") // only one of these can be present at the same time
.min(2) // at least 2 items must be present, which means there can not be interaction on a post without like, dislike or comment
.required()

const getPostSchema = Joi.object({
  "topic": Joi.array().items(Joi.string().valid("Politics", "Health", "Sport", "Tech")),
  "status": Joi.string().valid("Valid", "Expired", "all"),
  "highestInterest": Joi.bool()
}).required()

function validateUser(req, res, next) {
  const {error} = userSchema.validate(req.body);
  if (error) {
    return res.status(400).send({"Error":error.details})
  }
  next()
}

function validateNewPost(req, res, next) {
  const {error} =  newPostSchema.validate(req.body)
  if (error) {
    return res.status(400).send({"Error":error.details})
  }
  next()
}

function validatePostInteraction(req, res, next) {
  const {error} = postInteractionSchema.validate(req.body)
  if (error) {
    return res.status(400).send({"Error":error.details})
  }
  next()
}

function validateGetPost(req, res, next) {
  if (!Array.isArray(req.query.topic) && req.query.topic) {
    req.query.topic = [req.query.topic];
  }
  const {error} = getPostSchema.validate(req.query)
  if (error) {
    return res.status(400).send({"Error":error.details})
  }
  next()
}

module.exports = {validateUser, validateNewPost, validatePostInteraction, validateGetPost}
