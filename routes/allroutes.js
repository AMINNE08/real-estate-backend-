const router = require('express').Router()

const userRoute = require("./user");
const favoriteRoutes = require ('./favorites')
const propertieRoute = require ('./propertie')
const transactionRoute = require ('./transaction')
const messageRoutes = require ('./message')
const authRouter = require ('./auth')
const authorizeRoutes = require ('./authorize')



//routes
router.use("/users", userRoute);
router.use("/favorites", favoriteRoutes);
router.use('/propertie', propertieRoute)
router.use("/transactions", transactionRoute);
router.use("/messages", messageRoutes);
router.use('/auth',authRouter)
router.use('/authorize', authorizeRoutes);

module.exports = router

