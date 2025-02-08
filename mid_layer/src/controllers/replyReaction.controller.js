const db = require("../database");
const { sendErrorToFrontEnd, sendErrorToFrontEndMsg } = require("../errorHandle/errorUtils");
const checkNoUndefined = require("../utils/checkIsFieldNoUndefined");

const { REACTION_DISLIKE, REACTION_THRESHOLD } = require('../common/reactionConfig');
const { pubsub, REPLY_FIND_OPTIONS, REPLY_REACTION_ISSUE_TRIGGER }  = require('../graphql/index');
const { moduleToJsonObj } = require("../graphql");

const REACTION_REQ_BODY = ['username', 'replyID', 'type'];

async function sendSubsctiption(reaction) {
  if (reaction.type !== REACTION_DISLIKE) {
    return;
  }

  // Do subscription, send this reply to clint.
  const count = await db.replyReaction.count({ where: { replyID: reaction.replyID, type: REACTION_DISLIKE } });
  if (count >= REACTION_THRESHOLD) {
    const reply = await db.reply.findByPk(reaction.replyID, REPLY_FIND_OPTIONS);
    await pubsub.publish(REPLY_REACTION_ISSUE_TRIGGER, { replyReactionIssue: moduleToJsonObj(reply) });
  }
}


// Get all reactions from database
exports.getAllReactions = async (req, res) => {
  try {
    const allReactions = await db.replyReaction.findAll();
    res.json(allReactions);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
};

// Get all reactions based on replyID
exports.getReactionsByReplyID = async (req, res) => {
  const { replyID } = req.params;

  try {
    // Make sure replyID is not null
    if (!replyID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing replyID parameter.');
      return;
    }

    const allReactions = await db.replyReaction.findAll({
      where: { replyID: replyID }
    });

    res.json(allReactions);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
};

// Get all reactions based on username
exports.getReactionsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // Make sure username is set.
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username parameter.');
      return;
    }

    const allReactions = await db.replyReaction.findAll({
      where: { username: username }
    });

    res.json(allReactions);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
};

// Check if a user react to a specific reply
exports.checkIfUserReact = async (req, res) => {
  const { username, replyID } = req.query;

  try {
    // Make sure username and replyID is not null
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username query parameter.');
      return;
    } else if (!replyID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing replyID query parameter.');
      return;
    }

    const reaction = await db.replyReaction.findOne({
      where: {
        username: username,
        replyID: replyID
      }
    });

    if (reaction === null) {
      sendErrorToFrontEndMsg(res, 400, 'Reaction not found.');
      return;
    }

    res.json(reaction);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
}

exports.getReplyRecSummary = async (req, res) => {
  const { username, replyID } = req.query;

  try {
    // Do error checking.
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username query parameter.');
      return;
    } else if (!replyID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing replyID query parameter.');
      return;
    }

    const reply = await db.reply.findByPk(replyID);
    if (!reply) {
      sendErrorToFrontEndMsg(res, 400, 'No this reply.');
      return;
    }

    const numOfLike = await db.replyReaction.count({
      where: {
        replyID: replyID,
        type: 'like',
      }
    });

    const numOfDisLike = await db.replyReaction.count({
      where: {
        replyID: replyID,
        type: 'dislike',
      }
    });

    const reaction = await db.replyReaction.findOne({
      where: {
        username: username,
        replyID: replyID
      }
    });

    res.json({ like: numOfLike, dislike: numOfDisLike, curUserReact: reaction });
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
}

// Add new reaction based on replyID
exports.addReaction = async (req, res) => {
  try {
    // Make sure no missing value in body
    if (!checkNoUndefined(req.body, REACTION_REQ_BODY)) {
      sendErrorToFrontEndMsg(res, 400, 'Missing important fields in request body.');
      return;
    }

    const reaction = await db.replyReaction.create({ ...req.body });
    res.status(201).json(reaction);

    sendSubsctiption(reaction);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Cannot react to this post.');
    console.log(e);
  }
}

// Remove reactions based on replyID and username
exports.deleteReaction = async (req, res) => {
  const { username, replyID } = req.query;

  try {
    // Make sure username and replyID is not empty.
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username parameter.');
      return;
    } else if (!replyID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing replyID parameter.');
      return;
    }

    const rowDeleted = await db.replyReaction.destroy({
      where: {
        username: username,
        replyID: replyID
      }
    })

    if (rowDeleted !== 1) {
      sendErrorToFrontEndMsg(res, 400, 'Delete Unsuccessful. No Reaction Found.');
      return;
    }

    res.json({});
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Delete failed.');
    console.log(e);
  }
}

// Update reaction with given username, replyID, and type
exports.updateReaction = async (req, res) => {
  try {
    // Make sure username, replyID, and type are all set.
    if (!checkNoUndefined(req.body, REACTION_REQ_BODY)) {
      sendErrorToFrontEndMsg(res, 400, 'Missing important fields in request body.');
      return;
    }

    const reaction = await db.replyReaction.findOne({
      where: {
        username: req.body.username,
        replyID: req.body.replyID
      }
    });

    if (!reaction) {
      sendErrorToFrontEndMsg(res, 400, 'Update unsuccessful, reaction not found.');
      return;
    }

    reaction.type = req.body.type;
    await reaction.save();

    res.json(reaction);
    sendSubsctiption(reaction);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Update failed.');
    console.log(e);
  }
}