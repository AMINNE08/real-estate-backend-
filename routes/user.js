const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
  } = require("../controllers/userControlleur");
  

  const router = require("express").Router();
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
module.exports = router;