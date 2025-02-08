const db = require("../database");
const { sendErrorToFrontEnd, sendErrorToFrontEndMsg } = require("../errorHandle/errorUtils");
const checkNoUndefined = require("../utils/checkIsFieldNoUndefined");
const { REACTION_DISLIKE, REACTION_THRESHOLD } = require('../common/reactionConfig');
const { pubsub, POST_REACTION_ISSUE_TRIGGER, POST_FIND_OPTIONS }  = require('../graphql/index');
const { moduleToJsonObj } = require("../graphql");

const REACTION_REQ_BODY = ['username', 'postID', 'type'];

async function sendSubscription(reaction) {
  if (reaction.type !== REACTION_DISLIKE) {
    return;
  }

  // Do subscription, send this post to clint.
  const count = await db.postReaction.count({ where: { postID: reaction.postID, type: REACTION_DISLIKE } });
  if (count >= REACTION_THRESHOLD) {
    const post = await db.post.findByPk(reaction.postID, POST_FIND_OPTIONS);
    await pubsub.publish(POST_REACTION_ISSUE_TRIGGER, { postReactionIssue: moduleToJsonObj(post) });
  }
}

// Get all reactions from database
exports.getAllReactions = async (req, res) => {
  try {
    const allReactions = await db.postReaction.findAll();
    res.json(allReactions);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
};

// Get all reactions based on postID
exports.getReactionsByPostID = async (req, res) => {
  const postID = req.params.postID;

  try {
    // Make sure post ID is not null
    if (!postID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing postID parameter.');
      return;
    }

    const allReactions = await db.postReaction.findAll({
      where: { postID: postID }
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
    // Make sure username is not null
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username parameter.');
      return;
    }

    const allReactions = await db.postReaction.findAll({ where: { username: username } });
    res.json(allReactions);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
};

// Check if a user react to a specific post
exports.checkIfUserReact = async (req, res) => {
  const username = req.query.username;
  const postID = req.query.postID;

  try {
    // Make sure username and postID is not null
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username parameter.');
      return;
    } else if (!postID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing postID parameter.');
      return;
    }

    const reaction = await db.postReaction.findOne({
      where: {
        username: username,
        postID: postID
      }
    });

    if (reaction === null) {
      sendErrorToFrontEndMsg(res, 400, 'Reaction Not Found!');
      return;
    }

    res.json(reaction);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
}

exports.getPostRecSummary =  async (req, res) => {
  const { username, postID } = req.query;

  try {
    // Make sure username and postID is not null
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username query parameter.');
      return;
    } else if (!postID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing postID query parameter.');
      return;
    }

    // Check if post exist.
    const post = await db.post.findByPk(postID);
    if (!post) {
      sendErrorToFrontEndMsg(res, 400, 'No this post.');
      return;
    }

    const numOfLike = await db.postReaction.count({
      where: {
        postID: postID,
        type: 'like',
      }
    });

    const numOfDisLike = await db.postReaction.count({
      where: {
        postID: postID,
        type: 'dislike',
      }
    });

    const reaction = await db.postReaction.findOne({
      where: {
        username: username,
        postID: postID
      }
    });

    res.json({ like: numOfLike, dislike: numOfDisLike, curUserReact: reaction });
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
}

// Add new reaction based on postID
exports.addReaction = async (req, res) => {
  try {
    // Make sure no missing value in body
    if (!checkNoUndefined(req.body, REACTION_REQ_BODY)) {
      sendErrorToFrontEndMsg(res, 400, 'Missing important fields in request body.');
      return;
    }

    const reaction = await db.postReaction.create({
      username: req.body.username,
      postID: req.body.postID,
      type: req.body.type
    });

    // Send res back to clint first.
    res.status(201).json(reaction);

    // Send the subscription to front end.
    await sendSubscription(reaction);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Cannot react to this post.');
    console.log(e);
  }
}

// Remove reactions based on postID and username
exports.removeReaction = async (req, res) => {
  const username = req.query.username;
  const postID = req.query.postID;

  try {
    // Make sure username and postID is not null
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username parameter.');
      return;
    } else if (!postID) {
      sendErrorToFrontEndMsg(res, 400, 'Missing postID parameter.');
      return;
    }

    const rowDeleted = await db.postReaction.destroy({
      where: {
        username: username,
        postID: postID
      }
    })

    if (rowDeleted === 0) {
      sendErrorToFrontEndMsg(res, 400, 'Delete unsuccessful, No reaction found.');
      return;
    }

    res.json({});
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Delete failed.');
    console.log(e);
  }
}

// Update reaction with given username, postID, and type
exports.updateReaction = async (req, res) => {
  try {
    // Make sure username, postID, and type is not null
    if (!checkNoUndefined(req.body, REACTION_REQ_BODY)) {
      sendErrorToFrontEndMsg(res, 400, 'Missing important fields in request body.');
      return;
    }

    const reaction = await db.postReaction.findOne({
      where: {
        username: req.body.username,
        postID: req.body.postID
      }
    })

    if (!reaction) {
      sendErrorToFrontEndMsg(res, 400, 'Update Unsuccessful, Reaction Not Found!');
      return;
    }

    reaction.type = req.body.type;
    await reaction.save();

    res.json(reaction);

    await sendSubscription(reaction);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Update failed.');
    console.log(e);
  }
}