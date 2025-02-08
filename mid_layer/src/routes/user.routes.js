const controller = require('../controllers/user.controller');

module.exports = (express, app) => {
  const router = express.Router();

  // Get all users
  router.get('/', controller.getAllUsers);

  // Get user by username. Add select avoid unknown issue.
  router.get('/select/:username', controller.getUserByUsername);

  // Signin user by username and password.
  router.get('/signin', controller.signin);

  // Add new user to backend.
  router.post('/', controller.addUser);

  // Delete user by username.
  router.delete('/:username', controller.deleteUserByUsername);

  // Update user by username.
  router.put('/:username', controller.updateUserByUsername);

  app.use('/api/user', router);
};
