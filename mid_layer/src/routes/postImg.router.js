const controller = require('../controllers/postImg.controller');

module.exports = (express, app) => {
  const router = express.Router();

  // Get all post Images.
  router.get('/', controller.getAllPostImgs);

  // Get post by postImgID.
  router.get('/select/:postImgID', controller.getPostImgByID);

  // Get postImgs by postID.
  router.get('/postID/:postID', controller.getPostImgsByPostID);

  // Add new postImg to backend.
  router.post('/', controller.addPostImg);

  // The parent url.
  app.use('/api/postImg', router);
};