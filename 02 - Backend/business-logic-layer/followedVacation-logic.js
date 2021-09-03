const dal = require("../data-access-layer/dal");
const vacationLogic = require("../business-logic-layer/vacation-logic");

async function getFollowedVacationAsync(uuid) {
    const sql = "SELECT * FROM follow WHERE uuid = ?";
    const response = await dal.executeAsync(sql, [uuid]);
    return response;
}
async function isFollowingAsync(follow) {
    const sql = "SELECT * FROM follow WHERE uuid = ? AND vacationId = ? ";
    const response = await dal.executeAsync(sql,  [follow.uuid, follow.vacationId]);
    return response;
}

async function addFollowerAsync(follow) {
    const sql = "INSERT INTO follow VALUES(DEFAULT, ?, ?)";
    const response = await dal.executeAsync(sql, [follow.uuid, follow.vacationId]);
    follow.followId = response.insertId;
    await vacationLogic.addOneFollowerAsync(follow.vacationId);
    return follow;
}

async function deleteFollowerAsync(followId,vacationId) {
    const sql = "DELETE FROM follow WHERE followId = ? ";
    await dal.executeAsync(sql, [followId]);
    await vacationLogic.removeOneFollowerAsync(vacationId);

}


module.exports = {
    isFollowingAsync,
    getFollowedVacationAsync,
    addFollowerAsync,
    deleteFollowerAsync
}