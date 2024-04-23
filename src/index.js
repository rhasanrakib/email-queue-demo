const fs = require('fs');
const path = require('path');


function findControllers(dir, fileList = []) {
    // Read all files and directories in the current directory
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        // Check if the current path is a directory
        if (fs.statSync(filePath).isDirectory()) {
            // If it's a directory, recursively continue the search
            findControllers(filePath, fileList);
        } else {
            // If it's a file, check if the file ends with `.controller.js`
            if (file.endsWith('.controller.js')) {
                // If it does, add it to the list
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

module.exports = {
    findControllers
};