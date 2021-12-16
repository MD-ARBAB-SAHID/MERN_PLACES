const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator")
const HttpError = require("../models/http-error");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

const AllUsers = async(req,res,next)=>{
    let users;
   try{
    users = await User.find({},'-password');
   }catch(err){
    return next(new HttpError("Fetching users data failed,try again",500));
   }
  res.json({users:users.map(users=>users.toObject({getters:true}))});
}

const signin = async (req,res,next)=>{
    const errors = validationResult(req);
    let existingUser;
    if(!errors.isEmpty())
    {
        return next(new HttpError("Invalid inputs passed,please check your inputs",404)) ;
    }
    const {name,email,password} = req.body;
try{
    existingUser = await User.findOne({email:email});
    
}catch(err){
    return next(new HttpError("Sign Up failed ,try again later",500))
}  

if(existingUser)
{
    return next(new HttpError("Users exists already,please login instead",422))
}
let hashedPass ;

try{
    hashPass = await bcrypt.hash(password,12);
}catch(err)
{
    return next(new HttpError("Could not create user,please try again",500));
}


 
   const createdUser = new User({
        name,
        email,
        image:req.file.path,
        password:hashPass,
        places:[]
    })

    try{
        await createdUser.save();
    }catch(err){
        return next(new HttpError("SignUp failed ,please try again ",500))
    }
    

    let token;
    try{
        token =  jwt.sign({userId:createdUser.id,email:createdUser.email},`${process.env.JWT_KEY}`,{expiresIn:'1h'})
    }catch(err)
    {
            return next(new HttpError("Could not sign you in,please try again",500));
    }

    res.json({userId:createdUser.id,email:createdUser.email,token:token});
}


const login = async (req,res,next)=>{
    let existingUser;
    const {email,password} = req.body;

    try{
        existingUser = await User.findOne({email:email});
    }catch(err){
        return next(new HttpError("Sign Up failed ,try again later",500))
    }  
    

    if(!existingUser )
    {
        return next(new HttpError("Invalid credentials",402));
    }
    
    let passIsValid = false;
try{
    passIsValid = await bcrypt.compare(password,existingUser.password)
}catch(err){
    return next(new HttpError("Could not log you in,please check your credentials and try again",500))
}
   if(!passIsValid)
   {
    return next(new HttpError("Could not log you in,please check your credentials and try again",401))
   }

   let token;
   try{
       token =  jwt.sign({userId:existingUser.id,email:existingUser.email},`${process.env.JWT_KEY}`,{expiresIn:'1h'})
   }catch(err)
   {
           return next(new HttpError("Could not log you in,please try again",500));
   }


    res.json({userId:existingUser.id,email:existingUser.email,token:token});
}

exports.AllUsers = AllUsers;
exports.login = login;
exports.signin = signin;