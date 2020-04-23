const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
   const header = req.headers['authorization'];
   const token = header && header.split(' ')[1];

   if (!token) return res.status(401).send({ error: 'Invalid access token.' });

   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) return res.status(403).send({ error: 'Access token invalid.' });
      req.body = user;
      next();
   });
};