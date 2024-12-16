const router = require('express').Router()

const userRoute = require("./user");
const authRouter = require ('./auth')
const residencyRoutes = require ('./residency')
const { authenticate } = require("../middlewares/authmiddleware");


//routes
router.use("/users", authenticate ,userRoute);
router.use('/auth',authRouter)
router.use('/residency',residencyRoutes);

module.exports = router

