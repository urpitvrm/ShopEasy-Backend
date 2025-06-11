const express = require('express');
const router = express.Router();
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");  
// const {isAdmin} = require("../middlewares/authMiddleware");  
const {
  registerController,
  loginController,
  forgotPasswordController,
  getAllUsersController,
  updateProfileController
} = require("../controllers/authController");


router.post("/register", registerController);
router.post("/login", loginController);
router.get("/test", requireSignIn, isAdmin, (req, res) => {
  res.send("Protected Route");
});
router.post("/forgot-password", forgotPasswordController);
router.get("/get-users", requireSignIn, isAdmin, getAllUsersController);

//user protected route
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//admin protected route

router.get("/admin-auth", requireSignIn,isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.put("/profile", requireSignIn, updateProfileController);


module.exports= router;


