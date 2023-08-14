const Joi = require('joi');
const animeList = require('../models/animeList');

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Get the Anime list of the logged-in user
const getMyAnimeList = async (req, res, next) => {
  
  const { userid } = req.query;

  const yourAnimeList = await animeList.find({userId: new ObjectId(userid)});
  console.log(yourAnimeList);
  if (!yourAnimeList.length) {
    return res.status(200).json([]);
  }

  return res.status(200).json({ data: yourAnimeList });

}

// Add a Anime to the user's list
const addAnimeToList = async (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    animeId: Joi.string().required(),
    status: Joi.number().integer().min(1).max(5),
    episodesSeen: Joi.number().min(0),
    rating: Joi.number().integer().min(0).max(10)  // 0 = rating not set !
    .default(0),
    title:Joi.string().required(),
    thumb:Joi.string().required(),
    type:Joi.string().optional(),      
  });

  const { error } = schema.validate(req.body);
  if(error) {
    console.log(error);
    return res.status(400).json({ error: error.details[0].message });
  };


const { userId, animeId, status=1, rating=0, title, thumb,  type, episodesSeen,} = req.body;
try {
  // is Anime already in the user's Anime list ?
  
  const animeAlreadyInUserList = await animeList.find({userId: new ObjectId(userId),animeId:animeId});
  
  if (animeAlreadyInUserList.length) {
    return res.status(401).json({ error: 'This Anime is already in your list' });
  };

  // add the Anime to the list
  const addedAnime = await animeList.create({
    userId,
    episodesSeen,
    animeId,
    status,
    rating,
    title,
    thumb,
    type,
    addedDate: Date.now()
  }
  );

  return res.status(200).json({ created: addedAnime });
  
  } catch (error) {
    console.log(error);
    next(error);
  }


}

// Update status & rating
const updateStatusAndRating = async (req, res, next) => {

  
  const schema = Joi.object({
    userId: Joi.string().required(),
    animeId: Joi.string().required(),
    status: Joi.number().valid(1,2,3,4,5,).optional(),
    rating: Joi.number().min(0).max(10).optional(),
    episodesSeen: Joi.number().optional()
  });

  const { error } = schema.validate(req.body);
  if(error) {
    return res.status(400).json({ error: error.details[0].message });
  };

  console.log('params=',req.params);


  const animeId = req.params.id;

  const { status, rating, episodesSeen, userId } = req.body;

  if (!(status || rating || episodesSeen)) {
    return res.status(400).json({error: "no changes were made"});
  };

  let payload = {}
  if(status) {
    payload.status = status;
  }
  if(rating) {
    payload.rating = parseInt(rating,10);
  }
  if(episodesSeen) {
    payload.episodesSeen = parseInt(episodesSeen,10)
  }

  try {
    console.log(new ObjectId(parseInt(animeId)));
    const updatedObject = await animeList.findOneAndUpdate(
      {animeId,userId: new ObjectId(userId)},
      payload,
      { new: true },
      );
      
    console.log(updatedObject);
  
    if (!updatedObject) {
      return res.status(400).json({ error: 'Could not update this object' });
    }
  
    return res.status(200).json({ data: updatedObject });

  } catch (error) {
    console.log(error);
    next(error)
  }
};

// Delete a Anime from the user's list
const deleteAnimeFromList = async (req, res, next) => {

  const userId = req.user.id;
  const { id } = req.params;
  const {animeId } = req.body
  console.log(id);
  try {

    const deletedAnime = await animeList.findOneAndRemove(
      {animeId:id,userId: new ObjectId(userId)});
    if(!deletedAnime) {
      return res.status(404).json({ error: 'This object id does not exist' });
    }
  
    return res.status(200).json({ deleted: deletedAnime });

  } catch(error) {
    next(error);
  }

}

module.exports = { getMyAnimeList, addAnimeToList, updateStatusAndRating, deleteAnimeFromList }