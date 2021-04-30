var jwt = require('jsonwebtoken');

exports.generateToken = (payload, callback) => {
  return jwt.sign(
    {
      payload,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    },
    callback
  );
};

exports.verifyToken = async (token) => {
  try {
    return await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.log(`Error in verify access token:  + ${error}`);
    return null;
  }
};