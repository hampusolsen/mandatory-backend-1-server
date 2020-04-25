const route = require('express').Router();
const controller = require('./controller');
const localware = require('./localware');
const middleware = require('../../mw/mw');

route.post(
   '/',
   middleware.authenticate,
   localware.validate('CREATE_ROOM'),
   controller.create,
);

route.post(
   '/join',
   middleware.authenticate,
   localware.validate('JOIN_ROOM'),
   controller.join,
);

route.post(
   '/leave',
   middleware.authenticate,
   localware.validate('LEAVE_ROOM'),
   controller.leave,
);

route.delete(
   '/:roomId',
   middleware.authenticate,
   localware.validate('DELETE_ROOM'),
   controller.delete,
);

module.exports = route;