const Web3 = require('web3');
const readlineSync = require('readline-sync');
const fs = require('fs');

// // Use the Web3 constructor to create a new Web3 object
const web3 = new Web3('https://testnet.flagscan.io');

async function main() {
    var password = readlineSync.question('encrypt account password? ', {
        hideEchoBack: true
    });

    var sourceFile = readlineSync.questionPath('keystore file path: ', {
        isFile: true
    });
    console.log('-- sourceFile: ' + sourceFile);

    const keystoreJson = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

    const account_info = web3.eth.accounts.decrypt(keystoreJson, password);
    console.log(account_info['address']);

    if (readlineSync.keyInYNStrict('Do you want to show privateKey ?')) {
        // Key that is not `Y` was pressed.
        console.log(account_info['privateKey']);
    }
}

main();

