const fs = require('fs');
const locations = require("./locations");

function deleteOldImage(oldImageName) {
    console.log("deleteOldImage")
    fs.unlinkSync(locations.getProductImageFile(oldImageName));
}
module.exports = deleteOldImage;