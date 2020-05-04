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
   '/join/:roomId',
   middleware.authenticate,
   localware.validate('JOIN_ROOM'),
   controller.join,
);

route.post(
   '/leave/:roomId',
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

route.get(
   '/:roomId',
   middleware.authenticate,
   localware.validate('RETRIEVE_ROOM'),
   controller.retrieve,
);

route.post(
   '/:roomId',
   middleware.authenticate,
   localware.validate('RETRIEVE_PRIVATE_ROOM'),
   controller.retrieve,
);

module.exports = route;