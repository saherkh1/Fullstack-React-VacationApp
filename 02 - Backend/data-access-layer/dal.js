const mysql = require("mysql");

const connection = mysql.createPool({
    host: global.config.database.host,
    user: global.config.database.user,
    password: global.config.database.password,
    database: global.config.database.name,
});

function executeAsync(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, result) => { // Execute the sql
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

module.exports = {
    executeAsync
};