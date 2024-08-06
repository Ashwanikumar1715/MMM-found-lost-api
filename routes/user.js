const express = require('express');
const router = express.Router();

const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controller/user');

const { verify } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.post('/register', registerUser)

router.get('/profile', verify, getUserProfile);
router.put('/profile', verify, updateUserProfile);

router.get('/users', verify, getUsers);
router.delete('/users/:userId', verify, deleteUser);
router.get('/users/:userId', verify, getUserById);
router.put('/users/:userId', verify, updateUser);

module.exports = router;
