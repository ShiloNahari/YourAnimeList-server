const Comments = require('../models/comments')
const Joi = require('joi');

const getAllComments = async(req,res,next) => {
  const {animeId} = req.body
  try {
    const comments = await Comments.find(animeId)
    if (comments.length <= 0){
      return res.status(200).send("be the first to comment!");
    }
    return res.status(200).json(comments);
  } catch (error) {
    next(error)
  }
}

const postComment = async(req,res,next) => {
  const {user, animeId, comment} = req.body

  try {
    const newComment = await Comments.create({
      user,
      animeId,
      comment,
      time:new Date(),
    })
    return res.status(200).json(comment)
  } catch (error) {
    next(error)
  }
}

const getCommentsByAnimeId = async(req,res, next) =>{
const {id:animeId} = req.params
console.log(animeId);
try {
  const comments = await Comments.find({animeId})
  console.log(comments);
  return res.status(200).json(comments)
} catch (error) {
  next(error)
}
}


module.exports = { getAllComments, postComment, getCommentsByAnimeId }
