const express = require ('express');
const authcontroller = require ('../controllers/authControlleur');
const router = express.Router();

router.post('/registre', authcontroller.registre);
router.post('/login',authcontroller.login);
router.post('/logout',authcontroller.logout)
router.post('/forgot-password', authcontroller.forgotPassword);
router.post('/reset-password', authcontroller.resetPassword);
router.get('/me', authcontroller.getMe); // New route for fetching user data

module.exports=router;