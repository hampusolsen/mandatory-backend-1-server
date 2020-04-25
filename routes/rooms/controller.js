const uuid = require('uuid').v4;
const { compare, hash } = require('bcrypt');
const { validationResult } = require('express-validator');
const Room = require('../../db/roomdb');

exports.create = async (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty) res.status(400).send({ error: '' });

   const created = Date.now();
   let password = req.body.password;
   let adminPassword = req.body.adminPassword;

   try {
      if (password) password = await hash(password, 10);
      if (adminPassword) adminPassword = await hash(adminPassword, 10);

      const room = {
         ...req.body,
         messages: [{
            content: `Room created ${created.toLocaleString('sv-SE')}`,
            timestamp: created.toLocaleString('sv-SE'),
         }],
         id: uuid(),
         admins: [req.query.ownerId],
         users: [req.query.ownerId],
         owner: req.query.ownerId,
         created,
         password,
         adminPassword,
      };

      Room.save(room);
   } catch ({ status, message }) {
      res.status(status).send({ error: message });
   };
};

exports.delete = async (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty()) return res.status(400).send(error);

   const { roomId } = req.params;
   const { adminPassword } = req.body;
   const room = Room.retrieve(roomId);

   try {
      const authorized = await compare(adminPassword, room.adminPassword);
      const owner = room.owner === req.user.id;
      if (!authorized || !owner) throw { status: 403, message: 'Unauthorized request.' };

      Room.delete(roomId);
   } catch ({ status, message }) {
      res.status(status).send({ error: message });
   };
};

exports.join = async (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty()) return res.status(400).send(error);

   const { roomId, userId } = req.query;
   const { password, adminPassword } = Room.retrieve(roomId);
   const { role } = req.body;

   try {
      let authorized;
      switch (role) {
         case 'admin':
            authorized = await compare(req.body.adminPassword, adminPassword);
            if (!authorized) throw { status: 403, message: 'Invalid password.' };
            break;

         case 'user':
            break;

         case 'vip':
            authorized = await compare(req.body.password, password);
            if (!authorized) throw { status: 403, message: 'Invalid password.' };
            break;

         default:
            throw { status: 400, message: 'Invalid user role.' };
      }

      Room.append({ role, userId });
   } catch ({ status, message }) {
      res.status(status).send({ error: message });
   };
};

exports.leave = async (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty()) return res.status(400).send(error);

   const { roomId, userId } = req.query;

   try {
      Room.leave(roomId, userId);
   } catch ({ status, message }) {
      res.status(status).send({ error: message });
   };
};
