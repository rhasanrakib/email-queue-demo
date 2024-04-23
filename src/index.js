const fs = require('fs');
const path = require('path');


function findControllers(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findControllers(filePath, fileList);
        } else {
            if (file.endsWith('.controller.js')) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

module.exports = {
    findControllers
};