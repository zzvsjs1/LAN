const controller = require('../controllers/userLoginCount.controller');

module.exports = (express, app) => {
  const router = express.Router();

  router.get('/', controller.getAllLoginCount);

  router.post('/', controller.addLoginCount);

  app.use('/api/userLoginCount', router);
}