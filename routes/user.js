const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    bookVisit,
    allBookings,
    cancelBookings,
  } = require("../controllers/userControlleur");
  const router = require("express").Router();
  const {authenticate} = require('../middlewares/authmiddleware');



  router.get("/", authenticate, getAllUsers);
  router.get("/:id", authenticate, getUserById);
  router.post("/", authenticate, createUser); 
  router.put("/:id", authenticate, updateUser);
  router.delete("/:id", authenticate, deleteUser);
  router.post('/bookVisit/:id', bookVisit)
  router.post("/allBookings", allBookings)
  router.post("/removeBooking/:id", cancelBookings)

module.exports = router;

