const controller = require('../controllers/postReaction.controller');

module.exports = (express, app) => {
  const router = express.Router();

  // Get all reactions to front end.
  router.get('/', controller.getAllReactions);

  // Get all reactions by postID.
  router.get('/postid-reaction/:postID', controller.getReactionsByPostID);

  // Get all reactions by username.
  router.get('/username-reaction/:username', controller.getReactionsByUsername);

  // Check if user react to a certain post
  router.get('/search', controller.checkIfUserReact);

  // Get the summary for this reaction.
  router.get('/summary', controller.getPostRecSummary);

  // Add new reaction by postID.
  router.post('/', controller.addReaction);

  // Remove a reaction by postID and username.
  router.delete('/delete', controller.removeReaction);

  // Update reaction by postID and username.
  router.put('/update', controller.updateReaction);

  app.use('/api/postreaction', router);
};