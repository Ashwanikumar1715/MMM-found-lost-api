const jwt=require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, 'SDHFJSDKFK', {
    expiresIn: '1h',
  });
};

module.exports = generateToken;
