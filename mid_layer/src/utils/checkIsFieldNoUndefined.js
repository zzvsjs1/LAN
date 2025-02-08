module.exports = (obj, params) => {
  console.assert(typeof obj === 'object');
  console.assert(Array.isArray(params));

  for (const paramElement of params) {
    if (obj[paramElement] === undefined) {
      return false;
    }
  }

  return true;
};
