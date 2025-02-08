const db = require('../database');
const { sendErrorToFrontEnd, sendErrorToFrontEndMsg } = require('../errorHandle/errorUtils');
const checkNoUndefined = require('../utils/checkIsFieldNoUndefined.js');

const REPLY_FIELDS = ['replyID', 'username', 'createDateTime', 'text', 'postID', 'parentReplyID', 'level', 'isDelByAdmin'];

const FIND_OPTIONS = { include: db.user };

exports.getAllReplies = async (req, res) => {
  try {
    const replies = await db.reply.findAll(FIND_OPTIONS);
    res.json(replies);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Mid layer error.');
    console.log(e);
  }
};

exports.getReplyByID = async (req, res) => {
  // Use username to get a user object.
  const replyID = req.params.replyID;

  try {
    if (!replyID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing parameter "replyID"');
      return;
    }

    const reply = await db.reply.findByPk(replyID, FIND_OPTIONS);

    if (reply === null) {
      sendErrorToFrontEndMsg(res, 400, 'Invalid replyID.');
      return;
    }

    res.json(reply);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Mid layer error.');
    console.log(e);
  }
};

exports.getReplyByPostID = async (req, res) => {
  const postID = req.params.postID;

  try {
    // console.log(req.params);
    if (!postID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing parameter "postID"');
      return;
    }

    const replies = await db.reply.findAll({ ...FIND_OPTIONS, where: { postID: postID } });
    res.json(replies);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Mid layer error.');
    console.log(e);
  }
};

exports.addReply = async (req, res) => {
  try {
    if (!checkNoUndefined(req.body, REPLY_FIELDS)) {
      sendErrorToFrontEndMsg(res, 400, 'Missing import fields in request body.');
      return;
    }

    db.sequelize.transaction(async (t) => {
      const newReply = await db.reply.create({ ...req.body }, { transaction: t });
      const ret = await db.reply.findByPk(newReply.replyID, { ...FIND_OPTIONS, transaction: t });
      res.json(ret);
    });
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Middle layout error.');
    console.log(e);
  }
};

exports.deleteReplyByID = async (req, res) => {
  const { replyID } = req.params;

  try {
    if (!replyID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing parameter "replyID"');
      return;
    }

    const numAffectRow = await db.reply.destroy({ where: { replyID: replyID, }, cascade: true });
    if (numAffectRow !== 1) {
      sendErrorToFrontEndMsg(res, 400, 'Delete failed.');
      return;
    }

    res.json({});
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Middle layout error.');
    console.log(e);
  }
};

exports.updateReplyByID = async (req, res) => {
  const { replyID } = req.params;

  try {
    if (!replyID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing parameter "replyID"');
      return;
    }

    if (req.body.replyID !== replyID) {
      sendErrorToFrontEndMsg(res, 400, 'Two reply ID not match.');
      return;
    }

    await db.reply.update({ ...req.body }, { where: { replyID: replyID, } });

    res.json({});
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Middle layout error.');
    console.log(e);
  }
};
