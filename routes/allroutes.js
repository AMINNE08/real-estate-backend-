const router = require('express').Router()

const userRoute = require("./user");
const favoriteRoutes = require ('./favorites')
const propertieRoute = require ('./propertie')
const transactionRoute = require ('./transaction')
const messageRoutes = require ('./message')
const authRouter = require ('./auth')
const authorizeRoutes = require ('./authorize')
const { authenticate } = require("../middlewares/authmiddleware");




//routes
router.use("/users", authenticate ,userRoute);
router.use("/favorites", favoriteRoutes);
router.use('/propertie', propertieRoute)
router.use("/transactions", transactionRoute);
router.use("/messages", messageRoutes);
router.use('/auth',authRouter)
router.use('/authorize', authorizeRoutes);

module.exports = router

