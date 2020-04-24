const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid').v4;
const { validationResult } = require('express-validator');
const User = require('../../db/userdb');
const Token = require('../../db/tokendb');

exports.create = async (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty()) return res.status(400).send(error);

   try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = {
         ...req.body,
         password: hashedPassword,
         rooms: [],
         id: uuid(),
      };

      User.save(user);

      res.status(201).send(user);
   } catch ({ status, message }) {
      res.status(status).send(message);
   };
};

exports.delete = async (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty()) return res.status(400).send(error);

   const user = User.retrieve({ id: req.params.userId });

   try {
      const authorized = await bcrypt.compare(req.body.password, user.password);
      if (authorized) {
         User.delete(user);
         res.sendStatus(204);
      } else {
         res.status(403).send({ error: 'Incorrect password.' });
      };
   } catch {
      res.status(400).send({ error: 'Id not found.' });
   };
};

exports.edit = async (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty()) return res.status(400).send(error);

   const user = User.retrieve({ id: req.params.userId });

   try {
      const authorized = await bcrypt.compare(req.body.password, user.password);
      if (authorized) {
         const updatedUser = { ...req.body };

         if (updatedUser.newPassword) {
            const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

            updatedUser.password = hashedPassword;
            delete updatedUser.newPassword;
         }

         User.patch(updatedUser);

         res.sendStatus(204);
      } else {
         res.status(403).send({ error: 'Incorrect password.' });
      };
   } catch ({ status, message }) {
      res.status(status).send(message);
   };
};

exports.login = async (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty()) return res.status(400).send(error);

   const user = User.retrieve({ email: req.body.email });
   if (!user) return res.status(400).send({ error: 'Unregistered e-mail.' });

   try {
      const authorized = await bcrypt.compare(req.body.password, user.password);
      if (authorized) {
         const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
         const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

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
   if (!validated) {
      Token.delete(req.body.refreshToken);
      return res.status(403).send({ error: 'Token life length expired. Session terminated.' });
   };

   jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, data) => {
      if (error) return res.status(403).send({ error: 'Invalid refresh token. Session terminated.' });
      const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);

      res.status(201).send({ accessToken });
   });
};