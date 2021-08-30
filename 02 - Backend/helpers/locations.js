const path = require("path");

const rootFolder = path.resolve(__dirname, "..", "..");
const productImagesFolder = path.join(rootFolder, "backend", "images", "products");
const notFoundImageFile = path.join(rootFolder, "backend", "images", "not-found.jpg");

function getProductImageFile(imageName) {
    if(!imageName) return null;
    return path.join(productImagesFolder, imageName);
}

module.exports = {
    getProductImageFile,
    notFoundImageFile
};