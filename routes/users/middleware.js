const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
   const header = req.headers['Authorization'];
   const token = header && header.split(' ')[1];

   if (!token) return res.status(401).send({ error: 'Invalid header content.' });

   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) return res.status(403).send({ error: 'Invalid access token.' });
      req.body = user;
      next();
   });
};