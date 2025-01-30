const fs = require('fs');
const path = require('path');

function generateIconListJSON(iconFolder) {
    const outputPath = path.join(__dirname, 'icons.json');

    fs.readdir(iconFolder, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        // Sort files alphabetically
        files.sort();

        const iconList = files.reduce((acc, file) => {
            const [name, format] = file.split('.');
            acc[name] = format;
            return acc;
        }, {});

        fs.writeFile(outputPath, JSON.stringify(iconList, null, 2), (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
            } else {
                console.log('Icon list JSON file has been generated');
            }
        });
    });
}
