const fs = require('fs');

fs.readdir(__dirname, (err, files) => {
    for(let file of files) {
        if(file.startsWith('twemoji--flag-'))
        {
            fs.rename(`${__dirname}/${file}`, `${__dirname}/${file.replace('twemoji--flag-', '')}`, err => {
                console.log(err);
            })
        }
    }
})
