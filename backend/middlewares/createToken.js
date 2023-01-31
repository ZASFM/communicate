const jwt = require('jsonwebtoken');

const createToken = (id) => {
   const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
   return jwtToken;
}

module.exports = createToken