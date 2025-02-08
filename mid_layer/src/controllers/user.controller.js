const db = require('../database');
const argon2 = require('argon2');
const { sendErrorToFrontEnd, sendErrorToFrontEndMsg } = require('../errorHandle/errorUtils');
const checkIsFieldNoUndefined = require('../utils/checkIsFieldNoUndefined.js');

const USER_FIELDS = [
  'username',
  'email',
  'password',
  'avatar',
  'joinDate',
  'isBlock'
];

async function hashString(str) {
  return await argon2.hash(str, { type: argon2.argon2id });
}

/**
 * Return all users to front end.
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.user.findAll();
    res.json(users);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Mid layer error.');
    console.log(e);
  }
};

/**
 * Return user by username to front end.
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.getUserByUsername = async (req, res) => {
  // Use username to get a user object.
  const username = req.params.username;

  try {
    const user = await db.user.findByPk(username);

    if (user === null) {
      sendErrorToFrontEndMsg(res, 400, `No username "${username}".`);
      return;
    }

    res.json(user);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Mid layout error.');
    console.log(e);
  }
};

/**
 * Return user to front end.
 * But need to verify the username and password.
 *
 * And error, return an error object.
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.signin = async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  try {
    if (!username || !password) {
      sendErrorToFrontEndMsg(res, 400, 'Missing query params username or password.');
      return;
    }

    const user = await db.user.findByPk(username);

    // If user invalid.
    if (user === null) {
      sendErrorToFrontEndMsg(res, 400, `No username "${username}".`);
      return;
    }

    // Verify the password hash value.
    if (!await argon2.verify(user.password, password)) {
      sendErrorToFrontEndMsg(res, 400, 'Invalid password.');
      return;
    }

    // Record all sign in event.
    const nowDate = new Date();
    const history = await db.userLoginCount.findOne({ where: { username: user.username, date: nowDate } });
    if (history === null) {
      await db.userLoginCount.create({ username: user.username, date: nowDate });
    }

    // Response user back to front end.
    res.json(user);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Middle layout error.');
    console.log(e);
  }
};

/**
 * Add a user into backend.
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.addUser = async (req, res) => {
  // Hash the password.
  try {
    if (!checkIsFieldNoUndefined(req.body, USER_FIELDS)) {
      sendErrorToFrontEndMsg(res, 400, 'Missing important fields in request body.');
      return;
    }

    // Hash password.
    req.body.password = await hashString(req.body.password);

    // Create new user.
    const newUser = await db.user.create({ ...req.body });

    // Return user back to front end.
    res.json(newUser);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Username not unique.');
    console.log(e);
  }
};

/**
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.deleteUserByUsername = async (req, res) => {
  const username = req.params.username;

  try {
    // Delete a user by username.
    const numAffectRow = await db.user.destroy({
      where: { username: username, },
      cascade: true,
    });

    if (numAffectRow !== 1) {
      sendErrorToFrontEndMsg(res, 400, `Delete failed, no username "${username}".`);
      return;
    }

    // If success, return empty to front end.
    res.json({});
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Delete failed, unknown error.');
    console.log(e);
  }
}

/**
 * Update user and sq.
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
exports.updateUserByUsername = async (req, res) => {
  const oldUsername = req.params.username;

  try {
    if (!oldUsername) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username parameter.');
      return;
    }

    const curUser = await db.user.findByPk(oldUsername);

    // Make sure username is existed.
    if (curUser === null) {
      sendErrorToFrontEndMsg(res, 400, `Invalid username "${oldUsername}".`);
      return;
    }

    // If the user want to change the username, we need to check if the new username exist.
    if (req.body.username !== oldUsername) {
      const count = await db.user.count({ where: { username: req.body.username } });
      if (count !== 0) {
        sendErrorToFrontEndMsg(res, 400, `Username "${req.body.username}" is already exist.`);
        return;
      }
    }

    // Check if we need to rehash password.
    if (req.body.password) {
      if (!await argon2.verify(curUser.password, req.body.password)) {
        req.body.password = await hashString(req.body.password)
      } else {
        req.body.password = curUser.password;
      }
    }

    await db.user.update({
        ...req.body
      }, {
        where: {
          username: oldUsername
        }
      }
    );

    // If success, return empty object.
    res.json({});
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Update failed.');
    console.log(e);
  }
}
