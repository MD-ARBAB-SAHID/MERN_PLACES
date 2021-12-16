const multer = require("multer");
const { v1: uuId } = require('uuid');
const MAP_KEY = {
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpeg'
}

const fileUpload = multer({
    limits:500000,
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
                cb(null,"uploads/images");
        },
        filename : (req,file,cb)=>{
                const ext = MAP_KEY[file.mimetype];
                cb(null,uuId()+'.'+ext);
        },


    }),
    fileFilter:(req,file,cb)=>{
        const isValid = !!MAP_KEY[file.mimetype];
        let error = isValid ? null : new Error("Invalid mime type")
        
        cb(error,isValid);
    }
})


module.exports = fileUpload;