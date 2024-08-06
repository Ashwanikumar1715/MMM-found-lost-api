const User = require('../models/user');
const generateToken = require('../utils/generateToken.js');
const { loggedin, admin } = require('../utils/verifyUser.js');

// Auth user & get token
// Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        ...user._doc,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Register a new user
// Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNo } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
    } else {
      const user = await User.create({ name, email, password, phoneNo });

      if (user) {
        res.status(201).json({
          ...user._doc,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ message: 'Invalid user data' });
      } 
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get user profile
// Private
const getUserProfile = async (req, res) => {
  try {
    if (loggedin(req)) {
      const user = await User.findById(req.user._id).select('-password');
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update user profile
// Private
const updateUserProfile = async (req, res) => {
  try {
    if (loggedin(req)) {
      const user = await User.findById(req.user._id);

      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phoneNo = req.body.phoneNo || user.phoneNo;

        if (req.body.password) {
          user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
          ...updatedUser._doc,
          password: null,
          token: generateToken(updatedUser._id),
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all users
// Private/Admin
const getUsers = async (req, res) => {
  try {
    if (admin(req)) {
      const users = await User.find({}).select('-password');
      res.json(users);
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete user
// Private/Admin
const deleteUser = async (req, res) => {
  try {
    if (admin(req)) {
      const user = await User.findById(req.params.userId);

      if (user) {
        await user.remove();
        res.json({ message: 'User removed' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get user by ID
// Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update user
// Private/Admin
const updateUser = async (req, res) => {
  try {
    if (admin(req)) {
      const user = await User.findById(req.params.userId);

      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phoneNo = req.body.phoneNo || user.phoneNo;
        user.isAdmin = req.body.isAdmin || user.isAdmin;

        const updatedUser = await user.save();

        res.json({
          ...updatedUser._doc,
          password: null,
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
