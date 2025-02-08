const controller = require('../controllers/profileVisit.controller');

module.exports = (express, app) => {
  const router = express.Router();

  // Get all reactions to front end.
  router.get('/', controller.getAllProfileVisits);

  router.post('/', controller.addProfileVisits);

  app.use('/api/profile-visit', router);
}