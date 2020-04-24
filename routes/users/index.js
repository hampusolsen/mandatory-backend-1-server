const route = require('express').Router();
const controller = require('./controllers');
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
   '/token',
   localware.validate('REFRESH_TOKEN'),
   controller.refresh,
);

route.put(
   '/:userId',
   localware.validate('EDIT_USER'),
   middleware.authenticate,
   controller.edit,
);

route.delete(
   '/:userId',
   localware.validate('DELETE_USER'),
   middleware.authenticate,
   controller.delete,
);

module.exports = route;