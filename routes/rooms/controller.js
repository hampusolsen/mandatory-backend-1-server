const uuid = require('uuid').v4;
const { compare, hash } = require('bcrypt');
const { validationResult } = require('express-validator');
const Room = require('../../db/roomdb');
const User = require('../../db/userdb');

exports.create = async (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty) res.status(400).send({ error: '' });

   const created = new Date().toLocaleString('sv-SE');
   const owner = { name: req.user.name, id: req.user.id };
   const roomId = uuid();
   const motd = req.body.motd || '';
   let password = req.body.password || '';
   let adminPassword = req.body.adminPassword || '';

   try {
      if (password) password = await hash(password, 10);
      if (adminPassword) adminPassword = await hash(adminPassword, 10);

      const roomMinified = {
         title: req.body.title,
         id: roomId,
      };

      const room = {
         ...req.body,
         messages: [],
         motd,
         admins: [owner],
         users: [owner],
         owner,
         created,
         password,
         adminPassword,
         id: roomId,
      };

      const user = User.retrieve({ id: owner.id });

      user.owner.push(roomMinified);
      user.rooms.push(roomMinified);

      User.patch(user);
      Room.save(room);

      res.status(201).send(room);
   } catch (error) {
      res.status(status).send({ error: message });
   };
};

exports.delete = async (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty()) return res.status(400).send(error);

   const { roomId } = req.params;
   const { adminPassword } = req.body;
   const room = Room.retrieve(roomId);
   const user = {
      ...req.user,
      owner: req.user.owner.filter(({ id }) => id !== roomId),
      rooms: req.user.rooms.filter(({ id }) => id !== roomId),
   };

   if (!room) return res.status(404).send({ error: 'Invalid room id.' });

   try {
      const owner = room.owner.id === req.user.id;

      if (room.adminPassword) {
         const authorized = await compare(adminPassword, room.adminPassword);
         if (!authorized || !owner) throw { status: 403, message: 'Unauthorized request.' };
      };

      Room.delete(roomId);
      User.patch(user);

      res.sendStatus(204);
   } catch ({ status, message }) {
      res.sendStatus(500);
   };
};

exports.join = async (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty()) return res.status(400).send(error);

   const { roomId } = req.params;
   const userId = req.user.id;
   const { users, password, adminPassword } = Room.retrieve(roomId);
   const { role } = req.body;

   try {
      if (users.includes(userId)) throw { status: 409, message: 'User already in room.' };
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

      Room.userJoin(roomId, { role, userId });
   } catch ({ status, message }) {
      res.status(status).send({ error: message });
   };
};

exports.leave = async (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty()) return res.status(400).send(error);

   try {
      Room.userLeave(req.query.roomId, req.user.id);
   } catch ({ status, message }) {
      res.status(status).send({ error: message });
   };
};

exports.retrieve = (req, res) => {
   const error = validationResult(req);
   if (!error.isEmpty()) return res.status(400).send(error);

   try {
      const room = Room.retrieve(req.params.roomId);
      if (!room) throw { status: 404, message: 'Invalid room id.' };

      res.status(200).send(room);
   } catch ({ status, message }) {
      res.status(status).send({ error: message });
   }
};
