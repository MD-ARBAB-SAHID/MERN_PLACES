const express = require('express');
const placesControllers = require("../controllers/places-controllers");
const HttpError = require('../models/http-error');
const router = express.Router();
const fileUpload= require("../Middlewares/multer");
const {check} = require("express-validator");
const authMiddleware = require("../Middlewares/auth");

router.get('/:pid',placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlaceByUserId);

router.use(authMiddleware);

router.post("/",fileUpload.single("image"),[check('title').not().isEmpty(),
check("description").isLength({min:5}),check("address").not().isEmpty()],placesControllers.addPlace);

router.patch("/:pid",[check("title").not().isEmpty(),check("description").isLength({min:5})],placesControllers.updatePlace);

router.delete("/:pid",placesControllers.deletePlace);


module.exports = router;
