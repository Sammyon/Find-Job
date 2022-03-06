const bcrypt = require("bcryptjs");

function hash(password) {
  return bcrypt.hashSync(password, 10);
}

function compare(password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword);
}

module.exports = { hash, compare };
