const { body, query, param } = require('express-validator');

/**
 * @schemas____
 * 
 * @CREATE_USER POST /users
 * {
 *    name: String,
 *    password: String,
 *    email: E-mail formatted string,
 * }
 * 
 * @EDIT_USER PUT /users/:userId
 * {
 *    name: String,
 *    password: String,
 *    email: E-mail formatted string,
 *    ?newPassword: String,
 * }
 * 
 * @DELETE_USER DELETE /users/:userId
 * {
 *    password: String,
 * }
 * 
 * @LOGIN_USER POST /login
 * {
 *    email: E-mail formatted string,
 *    password: String,
 * }
 * 
 * @REFRESH_TOKEN POST /users/:userId/token?refresh=true
 * {
 *    refreshToken: JWT formatted string,
 * }
 */

const ERR_EMAIL = 'Invalid email.';
const ERR_ID = 'Invalid ID.';
const ERR_JWT = 'Missing or invalid JWT format.';
const ERR_NAME = 'Invalid name length';
const ERR_PW = 'Invalid password length.';
const ERR_QUERY = 'Invalid URI query.';

exports.validate = (method) => {
   switch (method) {
      case 'CREATE_USER':
         return [
            body('name', ERR_NAME).isLength({ min: 2 }),
            body('email', ERR_EMAIL).isEmail(),
            body('password', ERR_PW).isLength({ min: 7 }),
         ];
      case 'DELETE_USER':
         return [
            param('userId', ERR_ID).isUUID(),
            body('password', ERR_PW).isLength({ min: 7 }),
         ];
      case 'EDIT_USER':
         return [
            param('userId', ERR_ID).isUUID(),
            body('email', ERR_EMAIL).isEmail(),
            body('password', ERR_PW).isLength({ min: 7 }),
            body('newPassword', ERR_PW)
               .isLength({ min: 7 })
               .optional(),
         ];
      case 'LOGIN_USER':
         return [
            body('email', ERR_EMAIL).isEmail(),
            body('password', ERR_PW).isLength({ min: 7 }),
         ];
      case 'REFRESH_TOKEN':
         return [
            param('userId', ERR_ID).isUUID(),
            query('refresh', ERR_QUERY).equals('true'),
            body('refreshToken', ERR_JWT).isJWT(),
         ];
   };
};