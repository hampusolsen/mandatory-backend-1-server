const jwt = require('jsonwebtoken');

module.exports = authenticate = (req, res, next) => {
   const { accessToken } = req.cookies;
   if (!accessToken) return res.status(401).send({ error: 'No access token provided.' });

   jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) return res.status(403).send({ error: 'Invalid access token.' });
      req.user = user;
      next();
   });
};