const route = require('express').Router();
const controller = require('./controller');
const localware = require('./localware');
const middleware = require('../../mw/mw');

route.post(
   '/',
   localware.validate('CREATE_USER'),
   controller.create,
);

route.post(
   '/login',
   localware.validate('LOGIN_USER'),
   controller.login,
);

route.post(
   '/:userId/token',
   localware.validate('REFRESH_TOKEN'),
   controller.refresh,
);

route.put(
   '/:userId',
   middleware.authenticate,
   localware.validate('EDIT_USER'),
   controller.edit,
);

route.delete(
   '/:userId',
   middleware.authenticate,
   localware.validate('DELETE_USER'),
   controller.delete,
);

/** @TODO_BELOW */
// route.post(
//    '/logout',
//    middleware.authenticate,
//    localware.validate('LOGOUT_USER'),
//    controller.logout,
// );

// route.get(
//    '/:userId',
//    middleware.authenticate,
//    localware.validate('RETRIEVE_USER'),
//    controller.retrieve,
// );

module.exports = route;