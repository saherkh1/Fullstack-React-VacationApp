const dal = require("../data-access-layer/dal");
const vacationLogic = require("./vacation-logic");

async function getFollowedVacationAsync(uuid) {
    const sql = "SELECT * FROM follow WHERE uuid = ?";
    const response = await dal.executeAsync(sql, [uuid]);
    return response;
}

async function addFollowerAsync(follow) {
    const sql = "INSERT INTO follow VALUES(DEFAULT, ?, ?)";
    const response = await dal.executeAsync(sql, [follow.uuid, follow.vacationId]);
    follow.followId = response.insertId;
    return follow;
}

async function getVacationFollowCountAsync(vacationId) {
    try{
    const sql = `SELECT COUNT(*) AS count FROM follow WHERE vacationId = ${vacationId}`;
    const Vacation = await dal.executeAsync(sql);
    return Vacation[0].count;
    }catch(err){
        console.log(err);
    }
}

async function deleteFollowerAsync(followId,vacationId) {
    const sql = "DELETE FROM follow WHERE followId = ? ";
    await dal.executeAsync(sql, [followId]);

}

module.exports = {
    
    getFollowedVacationAsync,
    addFollowerAsync,
    deleteFollowerAsync,
    getVacationFollowCountAsync

}