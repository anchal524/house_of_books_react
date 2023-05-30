const { ObjectId } = require('mongodb');

function checkId(id) {
  if (!id || typeof id !== 'string' || !id.trim().replace(/\s/g, '').length) {
    return false;
  }

  if (!ObjectId.isValid(id)) {
    return false;
  }
  return true;
}

function checkString(str) {
  if (
    !str ||
    typeof str !== 'string' ||
    !str.trim().replace(/\s/g, '').length
  ) {
    return false;
  }
  return true;
}

function checkRating(num) {
  num = parseInt(num);
  if (
    !num ||
    typeof num !== 'number' ||
    !Number.isInteger(num) ||
    num < 1 ||
    num > 5
  ) {
    return false;
  }
  return true;
}

function checkDate(date) {
  if (typeof date !== 'string' || !date.trim().replace(/\s/g, '').length) {
    return false;
  }
  const currentDate = new Date();
  const checkingDate = new Date(date.trim());

  if (
    currentDate.getFullYear() !== checkingDate.getFullYear() ||
    currentDate.getMonth() !== checkingDate.getMonth() ||
    currentDate.getDate() !== checkingDate.getDate()
  ) {
    return false;
  }
  return true;
}

function checkUsername(username) {
  if (!username) {
    return false;
  }
  username = username.toLowerCase();
  if (
    typeof username != 'string' ||
    username.length === 0 ||
    username.length < 4
  ) {
    return false;
  } else if (/\s/.test(username)) {
    return false;
  }
  let str = username;
  const checker = /[^a-z0-9]/g;
  if (checker.test(str)) {
    return false;
  }
  return true;
}

module.exports = {
  checkId,
  checkString,
  checkRating,
  checkDate,
  checkUsername,
};
