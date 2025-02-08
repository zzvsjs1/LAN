const db = require('../database');
const { sendErrorToFrontEnd, sendErrorToFrontEndMsg } = require('../errorHandle/errorUtils');
const checkNoUndefined = require('../utils/checkIsFieldNoUndefined.js');

const POST_IMG_REQ_BODY = ['postImgID', 'postID', 'url', 'order'];
exports.POST_IMG_REQ_BODY = POST_IMG_REQ_BODY;

// Please see user.controller for detailed API descriptions.
exports.getAllPostImgs = async (req, res) => {
  try {
    const postImgs = await db.postImg.findAll();
    res.json(postImgs);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Mid layer error.');
    console.error(e);
  }
};

exports.getPostImgByID = async (req, res) => {
  const { postImgID } = req.params;

  try {
    if (!postImgID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing postImgID parameter.');
      return;
    }

    const postImg = await db.postImg.findByPk(postImgID);
    if (postImg === null) {
      sendErrorToFrontEndMsg(res, 400, `PostImgID "${postImgID}" is invalid.`);
      return;
    }

    res.json(postImg);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Mid layer error.');
    console.error(e);
  }
};

exports.getPostImgsByPostID = async (req, res) => {
  const { postID } = req.params;

  try {
    if (!postID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing postID parameter.');
      return;
    }

    if (await db.post.count({ where: { postID: postID } }) === 0) {
      sendErrorToFrontEndMsg(res, 400, 'postID invalid.');
      return;
    }

    const postImgs = await db.postImg.findAll({ where: { postID: postID } });
    res.json(postImgs);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Mid layer error.');
    console.error(e);
  }
}

exports.addPostImg = async (req, res) => {
  try {
    if (!checkNoUndefined(req.body, POST_IMG_REQ_BODY)) {
      sendErrorToFrontEndMsg(res, 400, 'Missing important fields in request body.');
      return;
    }

    const newPostImg = await db.postImg.create({
      postImgID: req.body.postImgID,
      postID: req.body.postID,
      url: req.body.url,
      order: req.body.order,
    });

    res.json(newPostImg);
  } catch (e) {
    sendErrorToFrontEnd(
      res, 400, e, 'PostImgID is not unique, internal error or no this post.'
    );
    console.error(e);
  }
};
