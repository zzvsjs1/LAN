const db = require('../database');
const { sendErrorToFrontEnd, sendErrorToFrontEndMsg } = require('../errorHandle/errorUtils');
const checkNoUndefined = require('../utils/checkIsFieldNoUndefined.js');

const POST_REQ_BODY = ['postID', 'username', 'createDateTime', 'text', 'isDelByAdmin'];

// Also fetch user.
const FIND_OPTIONS = {
  include: [db.postImg, db.user],
  order: [
    [db.postImg, 'order', 'ASC']
  ],
};

/**
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await db.post.findAll(FIND_OPTIONS);
    res.json(posts);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
};

/**
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.getPostByPostID = async (req, res) => {
  const { postID } = req.params;

  try {
    if (!postID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing postID parameter.');
      return;
    }

    const post = await db.post.findByPk(postID, FIND_OPTIONS);
    if (post === null) {
      sendErrorToFrontEndMsg(res, 400, `PostID "${postID}" is invalid.`);
      return;
    }

    res.json(post);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
};

/**
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.getPostsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username parameter.');
      return;
    }

    // Get a list of post and return.
    const posts = await db.post.findAll({ where: { username: username }, ...FIND_OPTIONS });
    res.json(posts);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
};

/**
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.addNewPost = async (req, res) => {
  try {
    // Check each field.
    if (!checkNoUndefined(req.body, POST_REQ_BODY)) {
      sendErrorToFrontEndMsg(res, 400, 'Missing important fields in request body.');
      return;
    }

    const postImgs = req.body.postImgs;
    if (!Array.isArray(postImgs)) {
      sendErrorToFrontEndMsg(res, 400, 'postImgs is not an array.');
      return;
    }

    // Check if array non-empty.
    if (postImgs !== 0) {
      const { POST_IMG_REQ_BODY } = require('./postImg.controller');

      for (const img of postImgs) {
        if (!checkNoUndefined(img, POST_IMG_REQ_BODY)) {
          sendErrorToFrontEndMsg(res, 400, 'Missing important fields in post images.');
          return;
        }
      }
    }

    let success = false;

    await db.sequelize.transaction(async (t) => {
      // Create a new post and return to the front end.
      const newPost = await db.post.create({
        ...req.body
      }, {
        transaction: t,
      });

      if (newPost === null) {
        throw new Error('Create post failed.');
      }

      for (const img of postImgs) {
        const newPostImg = await newPost.createPostImg({ ...img }, { transaction: t, });
        if (newPostImg === null) {
          throw new Error('Create post image failed.')
        }
      }

      t.afterCommit(() => {
        success = true;
      });
    });

    if (success) {
      const post = await db.post.findByPk(req.body.postID, FIND_OPTIONS);
      res.status(201).json(post);
      return;
    }

    sendErrorToFrontEndMsg(res, 400, 'Post create failed.');
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'PostID is not unique, internal error or no this user.');
    console.log(e);
  }
};

exports.deletePostByPostID = async (req, res) => {
  const { postID } = req.params;

  try {
    if (!postID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing postID parameter.');
      return;
    }

    // Delete one row by pk.
    const numAffRow = await db.post.destroy({ where: { postID: postID } });

    // Using pk means we only delete one row.
    if (numAffRow !== 1) {
      sendErrorToFrontEndMsg(res, 400, 'Delete failed.');
      return;
    }

    res.json({});
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
};

exports.deletePostsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // Verify parameter.
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username parameter.');
      return;
    }

    // Delete one row by pk.
    await db.post.destroy({ where: { username: username } });

    // Unused, but still return the count.
    res.status(204).json({});
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
};

exports.updatePostByPostID = async (req, res) => {
  const { postID } = req.params;

  try {
    // Check post id.
    if (!postID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username postID.');
      return;
    }

    // Check body.
    if (!checkNoUndefined(req.body, POST_REQ_BODY)) {
      sendErrorToFrontEndMsg(res, 400, 'Missing important fields in request body.');
      return;
    }

    // Check post id.
    if (postID !== req.body.postID) {
      sendErrorToFrontEndMsg(res, 400, 'Two post ids are not match.');
      return;
    }

    // Check post image, it should be an array.
    const postImgs = req.body.postImgs;
    if (!Array.isArray(postImgs)) {
      sendErrorToFrontEndMsg(res, 400, 'postImgs is not an array.');
      return;
    }

    // Start update. Guaranteed Atomicity.
    await db.sequelize.transaction(async (t) => {
      // Update one post. Do not update post ID.
      await db.post.update({
          ...req.body
        }, {
          where: { postID: postID, },
          transaction: t,
        });

      // Remove all images.
      await db.postImg.destroy({ where: { postID: postID }, transaction: t });

      // Add all post images.
      for (const img of postImgs) {
        const newPostImg = await db.postImg.create({ ...img }, { transaction: t, });
        if (newPostImg === null) {
          throw new Error('Create post image failed.')
        }
      }
    });

    // Return object back.
    res.status(201).json(await db.post.findByPk(req.body.postID, FIND_OPTIONS));
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Update failed.');
    console.log(e);
  }
};
