const express = require("express");
const router = express.Router();
const fileUpload = require("../Middlewares/multer")
const UsersControllers = require("../controllers/users-controller")

const {check} = require("express-validator");
router.get("/",UsersControllers.AllUsers);

router.post("/signin",fileUpload.single('image'),[check("name").not().isEmpty(),check("email").isEmail(),check("password").isLength({min:5})],UsersControllers.signin);


router.post("/login",UsersControllers.login);


module.exports = router;


