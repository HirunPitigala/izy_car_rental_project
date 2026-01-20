
const bcrypt = require('bcrypt');
const password = process.argv[2] || 'admin123';
const saltRounds = 10;
bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) console.error(err);
    else console.log(hash);
});
