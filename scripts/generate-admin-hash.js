
const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter password to hash: ', (password) => {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error('Error generating hash:', err);
        } else {
            console.log('\nGenerated Bcrypt Hash:');
            console.log(hash);
            console.log('\nCopy this hash for your SQL INSERT statement.');
        }
        rl.close();
    });
});
