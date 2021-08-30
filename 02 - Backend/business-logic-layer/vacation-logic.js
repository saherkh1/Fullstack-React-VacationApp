const dal = require("../data-access-layer/dal");

async function getAllVacationAsync() {
    const sql = "SELECT * FROM vacation";
    const Vacations = await dal.executeAsync(sql);
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
    vacation.followersCount = info.fieldCount;
    return vacation;
}


async function deleteVacationAsync(vacationId) {
    const sql = "DELETE FROM vacation WHERE vacationId = " + vacationId;
    await dal.executeAsync(sql);
}

async function updateFullVacationAsync(vacation) {
    const sql = `UPDATE vacation SET description = '${vacation.description}',
        destination = '${vacation.destination}',
        image = '${vacation.image}',
        startTime = '${vacation.startTime}',
        endTime = '${vacation.endTime}',
        price = ${vacation.price}
       WHERE vacationId = ${vacation.vacationId}`;
    const info = await dal.executeAsync(sql);
    const response = info.affectedRows === 0 ? null : vacation;
    return response;
}

// Update partial candy:
async function updatePartialVacationAsync(vacation) {
    console.log(vacation);
    const existingVacation = await getOneVacationAsync(vacation.vacationId);
    if(!existingVacation) return null;
    for(const prop in vacation) {
        if(prop in existingVacation && vacation[prop] && vacation[prop] !== 'null' && vacation[prop] !== '' ) {
            existingVacation[prop] = vacation[prop];
        }
    }
    // updateFullVacationAsync(existingVacation);
    return await updateFullVacationAsync(existingVacation);
}
module.exports = {
    getAllVacationAsync,
    addVacationAsync,
    getOneVacationAsync,
    deleteVacationAsync,
    updateFullVacationAsync,
    updatePartialVacationAsync
};

