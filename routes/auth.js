const express = require ('express');
const authcontroller = require ('../controllers/authControlleur');
const router = express.Router();
const { authenticate } = require('../middlewares/authmiddleware');
const { authorizeRole } = require('../middlewares/authorizeRole');

router.post('/registre', authcontroller.registre);
router.post('/login',authcontroller.login);
router.post('/logout',authcontroller.logout)
router.post('/forgot-password', authcontroller.forgotPassword);
router.post('/reset-password', authcontroller.resetPassword);


router.get('/dashboard', authenticate, authorizeRole('admin'), (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard" });
});


module.exports=router;