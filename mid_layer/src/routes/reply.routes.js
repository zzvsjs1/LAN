const controller = require('../controllers/reply.controller');

module.exports = (express, app) => {
  const router = express.Router();

  // Get all replies.
  router.get('/', controller.getAllReplies);

  router.get('/select/:replyID', controller.getReplyByID);

  router.get('/postID/:postID', controller.getReplyByPostID);

  router.post('/', controller.addReply);

  router.delete('/:replyID', controller.deleteReplyByID);

  // Update user by replyID.
  router.put('/:replyID', controller.updateReplyByID);

  app.use('/api/reply', router);
}