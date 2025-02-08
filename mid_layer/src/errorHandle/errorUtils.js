const isString = require('../utils/isString.js');

/**
 * Return a error object.
 *
 * @param errorObj
 * @param message
 * @returns {{error: {name, message: string}}}
 */
function buildErrObj(errorObj, message) {
  return {
    'error': {
      name: errorObj.name,
      message: message ?? 'Unknown error,',
    },
  };
}

function buildErrObjMsg(name, msg) {
  return {
    'error': {
      name: name,
      message: msg,
    },
  };
}

function sendErrorToFrontEndMsg(res, status, message) {
  res.status(status).json(
    buildErrObjMsg(
      'Error',
      message
    )
  );
}

/**
 * Send the error to front end by object and msg.
 *
 * @param res
 * @param status
 * @param errorObjOrMsg
 * @param message
 */
function sendErrorToFrontEnd(res, status, errorObjOrMsg, message) {
  // If string
  if (isString(errorObjOrMsg)) {
    res.status(status).json(
      buildErrObjMsg(
        'Error',
        message
      )
    );

    return;
  }

  // If error object.
  if (errorObjOrMsg instanceof Error) {
    res.status(status).json(
      buildErrObjMsg(
        errorObjOrMsg.name,
        message
      )
    );

    return;
  }

  // logic error.
  throw new Error('Logic error');
}

module.exports = {
  buildErrObj,
  buildErrObjMsg,
  sendErrorToFrontEnd,
  sendErrorToFrontEndMsg,
};
