const controller = require('../controllers/replyReaction.controller');

module.exports = (express, app) => {
  const router = express.Router();

  // Get all reactions to front end.
  router.get('/', controller.getAllReactions);

  // Get all reactions by replyID.
  router.get('/replyid-reaction/:replyID', controller.getReactionsByReplyID);

  // Get all reactions by username.
  router.get('/username-reaction/:username', controller.getReactionsByUsername);

  // Check if user react to a certain post
  router.get('/search', controller.checkIfUserReact);

  // Get the summary for a reply reaction.
  router.get('/summary', controller.getReplyRecSummary);

  // Add new reaction by replyID.
  router.post('/', controller.addReaction);

  // Remove a reaction by replyID and username.
  router.delete('/delete', controller.deleteReaction);

  // Update reaction by replyID and username.
  router.put('/update', controller.updateReaction);

  app.use('/api/replyreaction', router);
};