const jwt = require("jsonwebtoken");
const dal = require("../data-access-layer/dal");
const cryptoHelper = require("../helpers/crypto-helper");

async function isUsernameTaken(username) {
    const sql = `SELECT * FROM users WHERE username = '${username}'`;
    const users = await dal.executeAsync(sql);
    return users.length > 0;
}

async function registerAsync(user) {
    // const sql = "INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?, ?)";
    // const info = await dal.executeAsync(sql, [user.firstName, user.lastName, user.username, user.password, user.authenticationId]);
    const sql = "INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?,DEFAULT)";
    const info = await dal.executeAsync(sql, [user.firstName, user.lastName, user.username, user.password]);
    user.id = info.insertId;
    delete user.password;
    user.token = cryptoHelper.getNewToken(user);
    return user;
};

async function loginAsync(credentials) {
    const sql = `SELECT * FROM users WHERE username = '${credentials.username}'`;
    const users = await dal.executeAsync(sql);
    if (users.length === 0) return null;
    const user = users[0];
    if( user.password !== credentials.password) return null;
    delete user.password;
    user.token = cryptoHelper.getNewToken(user);
    return user;
}

module.exports = {
    isUsernameTaken,
    registerAsync,
    loginAsync
};