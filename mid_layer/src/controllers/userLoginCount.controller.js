const db = require("../database");
const { sendErrorToFrontEnd, sendErrorToFrontEndMsg } = require("../errorHandle/errorUtils");

exports.getAllLoginCount = async (req, res) => {
  try {
    const allRecord = await db.userLoginCount.findAll();
    res.json(allRecord);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Mid layer error.');
    console.log(e);
  }
}

exports.addLoginCount = async (req, res) => {
  const { username } = req.body;

  try {
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username in body.');
      return;
    }

    // Add new record.
    const nowDate = new Date();
    const history = await db.userLoginCount.findOne({ where: { username: username, date: nowDate } });
    if (history === null) {
      const ret = await db.userLoginCount.create({ username: username, date: nowDate });
      res.json(ret);
      return;
    }

    // If we don't need to create, return empty object.
    res.json({});
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Create new login record failed.');
    console.log(e);
  }
}