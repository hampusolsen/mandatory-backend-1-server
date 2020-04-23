const { body, query } = require('express-validator');

module.exports = (method) => {
   switch (method) {
      case 'CREATE_USER':
         return [
            body(['email', 'name', 'password', 'date-of-birth']).exists(),
            body('email').isEmail(),
            body('password').isLength({ min: 7 }),
            body('date-of-birth').isISO8601(),
         ];
      case 'REFRESH_TOKEN':
         return [
            query('refresh', 'Invalid URI query.').toBoolean(true).equals(true),
            body('refreshToken', 'Missing or invalid JWT format.').isJWT(),
         ];
   };
};