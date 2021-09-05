const dal = require("../data-access-layer/dal");
const followLogic = require("./followedVacation-logic")
const vacationModel = require("../models/vacation");

async function getAllVacationAsync() {
    const sql = "SELECT * FROM vacation";
    const Vacations = await dal.executeAsync(sql);
    Vacations.map(async (value) => {
        const count = await followLogic.getVacationFollowCountAsync(value.vacationId);
        value.followersCount = count;
    });
    return Vacations;
}

async function getOneVacationAsync(vacationId) {
    const sql = `SELECT * FROM vacation WHERE vacationId = ${vacationId}`;
    const Vacation = await dal.executeAsync(sql);
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
    const query = "select image FROM vacation WHERE vacationId = ?";
    const queryResponse = await dal.executeAsync(query, [vacationId]);
    const sql = "DELETE FROM vacation WHERE vacationId = " + vacationId;
    await dal.executeAsync(sql);
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
    const existingVacation = await getOneVacationAsync(vacation.vacationId);
    if (!existingVacation) return null;
    for (const prop in vacation) {
        if (prop in existingVacation && vacation[prop] && vacation[prop] !== 'null' && vacation[prop] !== '') {
            if(prop === "startTime" || prop === "endTime") existingVacation[prop] = new Date(vacation[prop]).toISOString();
            else existingVacation[prop] = vacation[prop];
            
        }
    }
    return existingVacation;
}


module.exports = {
    getAllVacationAsync,
    addVacationAsync,
    getOneVacationAsync,
    deleteVacationAsync,
    updateFullVacationAsync,
    PartialVacationUpdateHelperAsync,
};

