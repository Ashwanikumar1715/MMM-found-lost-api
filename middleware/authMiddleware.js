const jwt=require('jsonwebtoken')
const User = require('../models/user');

const verify = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, 'SDHFJSDKFK');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'No token, authorization denied' });
  }
};

module.exports = { verify };
