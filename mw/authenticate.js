const jwt = require('jsonwebtoken');

module.exports = authenticate = (req, res, next) => {
   const bearer = req.headers.authorization;
   const token = bearer && bearer.split(' ')[1];

   if (!token) return res.status(401).send({ error: 'Bearer not provided.' });

   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, _body) => {
      if (error) return res.status(403).send({ error: 'Invalid access token.' });
      next();
   });
};