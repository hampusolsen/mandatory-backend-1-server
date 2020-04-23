const route = require('express').Router();
const controllers = require('./controllers');
const middleware = require('./middleware');
const validate = require('./validate');

route.post(
   '/',
   validate('CREATE_USER'),
   controllers.create,
);

route.get(
   '/',
   middleware.authenticate,
   controllers.retrieve,
);

route.post(
   '/token',
   validate('REFRESH_TOKEN'),
   controllers.refresh,
);

module.exports = route;