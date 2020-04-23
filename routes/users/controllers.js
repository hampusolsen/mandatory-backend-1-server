const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid').v4;
const { validationResult } = require('express-validator');
const User = require('../../db/userdb');
const Token = require('../../db/tokendb');

exports.create = async (req, res) => {
   try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = {
         ...req.body,
         password: hashedPassword,
         id: uuid(),
      };

      User.save(user);

      res.sendStatus(201);
   } catch ({ status, message }) {
      res.status(status).send(message);
   }
};

exports.login = async (req, res) => {
   const user = User.retrieve(req.body.email);
   if (!user) return res.status(400).send({ error: 'Cannot find user with provided e-mail.' });

   try {
      const authenticated = await bcrypt.compare(req.body.password, user.password);
      if (authenticated) {
         const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
         const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

         Token.save(refreshToken);

         res.status(200).send({ accessToken, refreshToken });
      } else {
         res.status(403).send({ error: 'Incorrect password.' });
      };
   } catch {
      res.sendStatus(500);
   };
};

exports.refresh = (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty()) return res.status(400).send(error);

   const validated = Token.validate(req.body.refreshToken);
   if (!validated) return res.status(403).send({ error: 'Invalid refresh token. Session terminated.' });

   jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
      if (error) return res.status(403).send({ error: 'Invalid refresh token. Session terminated.' });
      console.log(user);
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

      res.status(201).send({ accessToken });
   });
};