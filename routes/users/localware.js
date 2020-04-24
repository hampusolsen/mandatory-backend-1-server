const { body, query, param } = require('express-validator');

exports.validate = (method) => {
   switch (method) {
      case 'CREATE_USER':
         return [
            body(['email', 'name', 'password', 'date-of-birth']).exists(),
            body('email').isEmail(),
            body('password').isLength({ min: 7 }),
            body('date-of-birth').isISO8601(),
         ];
      case 'DELETE_USER':
         return [
            param('userId').exists().isUUID(),
            body('password').exists().isLength({ min: 7 }),
         ];
      case 'EDIT_USER':
         return [
            param('userId').exists().isUUID(),
            body(['email', 'name', 'password', 'date-of-birth']).exists(),
            body('email').isEmail(),
            body('password').isLength({ min: 7 }),
            body('date-of-birth').isISO8601(),
            body('newPassword').optional().isLength({ min: 7 }),
         ];
      case 'LOGIN_USER':
         return [
            body('email').isEmail(),
            body('password').isLength({ min: 7 }),
         ];
      case 'REFRESH_TOKEN':
         return [
            query('refresh', 'Invalid URI query.').equals('true').toBoolean(true),
            body('refreshToken', 'Missing or invalid JWT format.').isJWT(),
         ];
   };
};