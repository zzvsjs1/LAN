const controller = require('../controllers/followers.controller');

/**
 * We don't need the update feature.
 * Because this table is only for following relationship.
 * 
 * @param express
 * @param app
 */
module.exports = (express, app) => {
  const router = express.Router();

  router.get('/', controller.getAllFollowers);

  router.get('/username', controller.getFollowingByUsername);

  router.get('/getFollowedAnUnfollowed', controller.getFollowedAndUnfollowed);

  router.post('/', controller.addFollowing);

  // Delete by the username.
  router.delete('/followersUsername/:followersUsername', controller.delByFollowersUsername);

  // Delete by two usernames.
  router.delete('/followersUsername/:followersUsername/followingUsername/:followingUsername',
    controller.delByTwoUsername);

  router.delete('/id/:id', controller.delByID);

  app.use('/api/follower', router);
}