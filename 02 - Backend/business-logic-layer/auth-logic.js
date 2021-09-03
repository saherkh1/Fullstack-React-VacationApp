const dal = require("../data-access-layer/dal");
const cryptoHelper = require("../helpers/crypto-helper");
const uuid = require("uuid");

async function isUsernameTaken(username) {
    const sql = `SELECT username FROM users WHERE username = '${username}'`;
    const users = await dal.executeAsync(sql);
    return users.length > 0;
}

async function registerAsync(user) {
    user.password = cryptoHelper.hash(user.password);
    user.uuid = uuid.v4(); // add to sql 
    const sql = "INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?, ?)";
    const sqlResponse = await dal.executeAsync(sql, [user.uuid, user.firstName, user.lastName, user.username, user.password]);
    user.id = sqlResponse.insertId;
    await setAuthorizationAsync(user);
    await addAuthorizationAsync(user);
    delete user.password;
    delete user.id;
    user.token = cryptoHelper.getNewToken(user);
    return user;
};

async function loginAsync(credentials) {
    credentials.password = cryptoHelper.hash(credentials.password);
    const sql = "SELECT id, uuid, firstName, lastName, username FROM users WHERE username = ? AND password = ?";
    const sqlResponse = await dal.executeAsync(sql, [credentials.username, credentials.password]);
    if (sqlResponse.length === 0) return null;
    const newUser = sqlResponse[0];
    await addAuthorizationAsync(newUser)
    newUser.token = cryptoHelper.getNewToken(newUser);
    delete newUser.id;
    return newUser;
}

async function addAuthorizationAsync(user){
    const sql = "SELECT role FROM authorization WHERE id = ? ";
    const role = await dal.executeAsync(sql, [user.id]);
    user.role = role[0].role;
    return user
}

async function setAuthorizationAsync(user){
    const sql = "INSERT INTO authorization VALUES(DEFAULT, ?, DEFAULT)";
    const role = await dal.executeAsync(sql, [user.id]);
    return role;
}

module.exports = {
    isUsernameTaken,
    registerAsync,
    loginAsync
};