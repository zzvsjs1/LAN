const db = require("../database");
const { sendErrorToFrontEnd, sendErrorToFrontEndMsg } = require("../errorHandle/errorUtils");

exports.getAllProfileVisits = async (req, res) => {
  try {
    const allVisites = await db.profileVisit.findAll();
    res.json(allVisites);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Internal error.');
    console.log(e);
  }
}

// Add one profile visit.
exports.addProfileVisits = async (req, res) => {
  const { username } = req.body;

  try {
    if (!username) {
      sendErrorToFrontEndMsg(res, 400, 'Missing username in body.');
      return;
    }

    const newObj = await db.profileVisit.create({ username: username });
    res.json(newObj);
  } catch (e) {
    sendErrorToFrontEnd(res, 400, e, 'Adding failed.');
    console.log(e);
  }
};
