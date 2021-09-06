const dal = require("../data-access-layer/dal");
const followLogic = require("./followedVacation-logic")
const vacationModel = require("../models/vacation");

async function getAllVacationAsync() {
    const sql = "SELECT * FROM vacation ";
    let vacations = await dal.executeAsync(sql);
    console.log(vacations)
    const  promises = vacations.map(async (value) => {
        const count = await getVacationFollowCountAsync(value.vacationId);
        value.followersCount = count;
    });
    await Promise.all(promises)
    return vacations;
}
async function getVacationFollowCountAsync(vacationId) {
    const sql = `SELECT COUNT(*) AS count FROM follow WHERE vacationId = ${vacationId}`;
    const Vacation = await dal.executeAsync(sql,[vacationId]);
    console.log(vacationId,Vacation[0].count)
    return Vacation[0].count;
}
async function getOneVacationAsync(vacationId) {
    const sql = `SELECT * FROM vacation WHERE vacationId = ${vacationId}`;
    const Vacation = await dal.executeAsync(sql);
    console.log("get one vacation async",Vacation)
    console.log(Vacation[0].startTime," =? ", Vacation[0].endTime)
    return Vacation[0];
}



async function addVacationAsync(vacation) {
    const sql = "INSERT INTO vacation VALUES(DEFAULT, ?, ?, ?, ?, ?, ?, DEFAULT)";
    const info = await dal.executeAsync(sql, [vacation.description, vacation.destination, vacation.image, vacation.startTime, vacation.endTime, vacation.price]);
    vacation.vacationId = info.insertId;
    vacation.followersCount = 0;
    return vacation;
}


async function deleteVacationAsync(vacationId) {
    console.log(vacationId)
    const query = "select image FROM vacation WHERE vacationId = ?";
    const queryResponse = await dal.executeAsync(query, [vacationId]);
    console.log(queryResponse[0].image)
    // const sql = "DELETE FROM vacation WHERE vacationId = " + vacationId;
    // await dal.executeAsync(sql);
    return queryResponse[0].image;
}

async function updateFullVacationAsync(vacation) {
    const sql = `UPDATE vacation SET description = ?,destination = ?, image = ?, startTime = ?, endTime = ?, price = ? WHERE vacationId = ?`;
    const info = await dal.executeAsync(sql, [vacation.description, vacation.destination, vacation.image, vacation.startTime, vacation.endTime, vacation.price, vacation.vacationId]);
    const response = info.affectedRows === 0 ? null : vacation;
    return response;
}

// Update partial candy:
async function PartialVacationUpdateHelperAsync(vacation) {
    // console.log(vacation);
    const existingVacation = await getOneVacationAsync(vacation.vacationId);
    // console.log("out of the box: ",existingVacation );
    if (!existingVacation) return null;
    for (const prop in vacation) {
        if (prop in existingVacation && vacation[prop] && vacation[prop] !== 'null' && vacation[prop] !== '') {
            if(prop === "startTime" || prop === "endTime") existingVacation[prop] = new Date(vacation[prop]).toISOString();
            else existingVacation[prop] = vacation[prop];
            
        }
    }
    // updateFullVacationAsync(existingVacation);
    return existingVacation;
}

// async function addOneFollowerAsync(vacationId) {
//     const sql = `UPDATE vacation SET followersCount = followersCount + 1 WHERE vacationId = ?`;
//     const info = await dal.executeAsync(sql, [vacationId]);
//     return info.affectedRows === 0 ? null : vacationId;
// }
// async function removeOneFollowerAsync(vacationId) {
//     const sql = `UPDATE vacation SET followersCount = followersCount - 1 WHERE vacationId = ?`;
//     const info = await dal.executeAsync(sql, [vacationId]);
//     return info.affectedRows === 0 ? null : vacationId;
// }
module.exports = {
    getAllVacationAsync,
    addVacationAsync,
    getOneVacationAsync,
    deleteVacationAsync,
    updateFullVacationAsync,
    PartialVacationUpdateHelperAsync,
    // addOneFollowerAsync,
    // removeOneFollowerAsync,
};

