const db = require("../database");
const { sendErrorToFrontEnd, sendErrorToFrontEndMsg } = require("../errorHandle/errorUtils");
const checkNoUndefined = require("../utils/checkIsFieldNoUndefined");

const FOLLOWER_REQ_BODY = ['followersUsername', 'followingUsername'];

// Return table content.
exports.getAllFollowers = async (req, res) => {
  try {
    const allFollowers = await db.followers.findAll();
    res.json(allFollowers);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
};

// The follower username.
exports.getFollowingByUsername = async (req, res) => {
  const { username } = req.query;

  try {
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username parameter.');
      return;
    }

    const allFollowers = await db.followers.findAll({
      where: { followersUsername: username, }
    });

    if (allFollowers.length === 0) {
      res.json([]);
      return;
    }

    const followerUsername = allFollowers.map(value => value.followingUsername);
    const allUser = await db.user.findAll({
      where: {
        username: {
          [db.Op.in]: followerUsername
        }
      }
    })

    res.json(allUser);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
};

exports.getFollowedAndUnfollowed = async (req, res) => {
  const { followersUsername } = req.query;

  try {
    if (!followersUsername) {
      sendErrorToFrontEndMsg(res, 400, 'Missing followersUsername parameter.');
      return;
    }

    let allFollowers = await db.followers.findAll({
      where: { followersUsername: followersUsername, }
    });

    // Copy the data, change to username.
    allFollowers = allFollowers.map(data => data.followingUsername);

    // Following for cur user.
    const following = await db.user.findAll({
      where: { username: allFollowers }
    });

    // Add cur user to data. Make sure not include current user.
    const allFollowersAndSelf = [...allFollowers];
    allFollowersAndSelf.push(followersUsername);

    // Not following user for cur user.
    const noFollowing = await db.user.findAll({
      where: {
        username: { [db.Op.notIn]: allFollowersAndSelf }
      }
    });

    res.json({
      following: following,
      noFollowing: noFollowing,
    });
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
}

exports.addFollowing = async (req, res) => {
  try {
    if (!checkNoUndefined(req.body, FOLLOWER_REQ_BODY)) {
      sendErrorToFrontEndMsg(res, 400, 'Missing important fields in request body.');
      return;
    }

    const newFollowing = await db.followers.create({ ...req.body });

    res.status(201).json(newFollowing);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Cannot add this following and follower.');
    console.log(e);
  }
};

// User table name to delete the follower.
exports.delByFollowersUsername = async (req, res) => {
  const { followersUsername } = req.params;

  try {
    if (!followersUsername) {
      sendErrorToFrontEndMsg(res, 400, 'Missing important parameter.');
      return;
    }

    const numAffRow = await db.followers.destroy({
      where: { followersUsername: followersUsername, }
    });

    if (numAffRow === 0) {
      sendErrorToFrontEndMsg(res, 400, 'Delete failed.');
      return;
    }

    res.json({});
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Delete failed.');
    console.log(e);
  }
}

exports.delByTwoUsername = async (req, res) => {
  const { followersUsername, followingUsername } = req.params;

  try {
    if (!followersUsername || !followingUsername) {
      sendErrorToFrontEndMsg(res, 400, 'Missing important parameter.');
      return;
    }

    const numAffRow = await db.followers.destroy({
      where: {
        followersUsername: followersUsername,
        followingUsername: followingUsername
      }
    });

    if (numAffRow !== 1) {
      sendErrorToFrontEndMsg(res, 400, 'Delete failed.');
      return;
    }

    res.json({});
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Delete failed.');
    console.log(e);
  }
}

exports.delByID = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      sendErrorToFrontEndMsg(res, 400, 'Missing important parameter.');
      return;
    }

    const numAffRow = await db.followers.destroy({ where: { id: id } });

    if (numAffRow !== 1) {
      sendErrorToFrontEndMsg(res, 400, 'Delete failed, no this id.');
      return;
    }

    res.json({});
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Delete failed.');
    console.log(e);
  }
}

