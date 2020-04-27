const { body, param, query } = require('express-validator');

/**
 * @schemas____
 * 
 * @CREATE_ROOM POST /rooms?ownerId=[userId]
 * {
 *    title: String,
 *    password: String || undefined,
 *    ?motd: String,
 * }
 * 
 * @JOIN_ROOM POST /rooms/join?roomId=[roomId]&userId=[userId]
 * {
 *    role: "admin" || "user" || "vip",
 *    ?password: String,
 *    ?adminPassword: String,
 * }
 * 
 * @LEAVE_ROOM POST /rooms/leave?roomId=[roomId]&userId=[userId]
 * 
 * @DELETE_ROOM DELETE /rooms/:roomId?delete=true
 * {
 *    ownerId: UUID formated string,
 *    adminPassword: String,
 * }
 */

const ERR_ID = 'Invalid id.';
const ERR_PARAM = 'Invalid URI parameter.';
const ERR_PW = 'Invalid password.';
const ERR_QUERY = 'Invalid query string';
const ERR_ROLE = 'Invalid user role. Expected "admin", "user" or "vip".';
const ERR_TITLE = 'Invalid room title.';

const isLengthOrNull = (value, _meta) => typeof value === 'string' && value.length >= 7 || value === null;

exports.validate = (method) => {
   switch (method) {
      case 'CREATE_ROOM':
         return [
            body('title', ERR_TITLE).isLength({ min: 1 }),
            body('motd')
               .isString()
               .optional(),
            body('adminPassword', ERR_PW).isLength({ min: 7 }),
            body('password', ERR_PW)
               .custom(isLengthOrNull)
               .optional(),
         ];
      case 'JOIN_ROOM':
         return [
            param('roomId', ERR_PARAM).isUUID(),
            body('role', ERR_ROLE).isIn(['admin', 'user', 'vip']),
            body(['password', 'adminPassword'], ERR_PW)
               .custom(isLengthOrNull)
               .optional(),
         ];
      case 'LEAVE_ROOM':
         return [
            param('roomId', ERR_PARAM).isUUID(),
         ];
      case 'DELETE_ROOM':
         return [
            param('roomId', ERR_ID).isUUID(),
            query('delete', ERR_QUERY).equals('true'),
            body('adminPassword', ERR_PW)
               .isLength({ min: 7 })
               .optional(),
         ];
      case 'RETRIEVE_ROOM':
         return [
            param('roomId', ERR_ID).isUUID(),
         ];
   }
};