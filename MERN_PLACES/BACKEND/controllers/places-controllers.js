const HttpError = require("../models/http-error");
const {validationResult} = require("express-validator")
const Places = require("../models/places");
const User = require("../models/users")
const mongoose = require("mongoose");
const fs = require("fs");


  
const getPlaceById = async (req,res,next)=>{
    const placeId = req.params.pid; // { pid: 'p1' }
    let place;
try{
  place = await Places.findById(placeId);
}catch(err){
  return next(new HttpError("Something went wrong.Try Agin",500))
}
   
  if (!place) {
  
   return next( new HttpError('Could not find a place for the provided id.',404));
  }

  res.json({place:place.toObject({getters:true})});
}

const getPlaceByUserId = async (req,res,next)=>{
    const userId = req.params.uid;
let place;
  try{
    place = await Places.find({creator:userId});
  }catch(err){
    return next(new HttpError("Something went wrong.Try Agin",500))
  }

  if (!place || place.length===0) {
    
    return next(new HttpError('Could not find a place for the provided user id.',404));
  }

  res.json({place:place.map((place)=>place.toObject({getters:true}))});
}

const addPlace  = async(req,res,next)=>{
const errors = validationResult(req);
let existingUser;
if(!errors.isEmpty())
{
  return next(new HttpError("Invalid inputs passed,please check your inputs",422)) ;
}
  const{title,description,address} = req.body;
try{
   existingUser = await User.findById(req.userData.userId);
}catch(err)
{
  return next(new HttpError("Something went wrong,try again",500));
}

if(!existingUser)
{
  return next(new HttpError("could not create place,try again",500));
}
 const createdPlace = new Places({
   title,
   description,
   address,
   location:{
   
      lat: 40.7484474,
      lng: -73.9871516
    },
    image:req.file.path,
    creator:req.userData.userId
   
 })

 try{
  const sess = await mongoose.startSession();
  sess.startTransaction();
  await createdPlace.save({session:sess});
  existingUser.places.push(createdPlace);
  await existingUser.save({session:sess});
  await sess.commitTransaction();

 }catch(err)
 {
  return next(new HttpError("Could not save place try again",500));
 }
  
 

  res.status(201).json(createdPlace);
}


const updatePlace = async (req,res,next)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty())
  {
    return next(new HttpError("Invalid inputs passed,please check your inputs",404)) ;
  }
  const pid = req.params.pid;

  const {title,description} = req.body;

  let place;
try{
  place = await Places.findById(pid);
}catch(err){
  return next(new HttpError("Something went wrong.Could not update Place",500))
}
if(place.creator.toString() !== req.userData.userId)
{
  return next(new HttpError("You are not allowed to do this",401));
}
place.title = title;
place.description = description;

try{
  await place.save();
}catch(err){
  return next(new HttpError("Something went wrong,could not update palce",500));
}
   

  res.status(200).json({place:place.toObject({getters:true})});
}

const deletePlace = async (req,res,next)=>{
  const pid = req.params.pid;
let place;
try{
  place = await Places.findById(pid).populate('creator')
}catch(err){
  return next(new HttpError("Something went wrong,could not delete place"),500);
}
if(req.userData.userId!==place.creator.id)
{
  return next(new HttpError("You are not allowed to do this",401));
}
const imagePath = place.image;
try{
  const sess = await mongoose.startSession();
   sess.startTransaction()
 await place.remove({session:sess});
 await place.creator.places.pull(place);
 await place.creator.save({session:sess});
 await sess.commitTransaction()
}catch(err)
{
  return next(new HttpError("Something went wrong,could not delete place"),500);
}
  fs.unlink(imagePath,(err)=>{
    console.log(err);
  })
  res.status(201).json({message:"deleted"});
}

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId
exports.addPlace = addPlace;
exports.updatePlace =updatePlace;
exports.deletePlace = deletePlace;