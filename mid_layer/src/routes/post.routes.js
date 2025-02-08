const controller = require('../controllers/post.controller');

module.exports = (express, app) => {
  const router = express.Router();

  // Send all posts to front end.
  router.get('/', controller.getAllPosts);

  // Get a post by username.
  router.get('/select/:postID', controller.getPostByPostID);

  // Get all the posts below to username.
  router.get('/username/:username', controller.getPostsByUsername);

  // Add new post by postID.
  router.post('/', controller.addNewPost);

  // Delete post by postID.
  router.delete('/postID/:postID', controller.deletePostByPostID);

  // Delete all posts by username.
  router.delete('/username/:username', controller.deletePostsByUsername);

  // Update post by postID.
  router.put('/:postID', controller.updatePostByPostID);

  app.use('/api/post', router);
};