const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
  } = require("../controllers/userControlleur");
  const router = require("express").Router();
  const { authenticate } = require('../middlewares/authmiddleware');



  router.get("/", authenticate, getAllUsers);
  router.get("/:id", authenticate, getUserById);
  router.post("/", authenticate, createUser); 
  router.put("/:id", authenticate, updateUser);
  router.delete("/:id", authenticate, deleteUser);

module.exports = router;

