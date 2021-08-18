const Blockchain = require('./blockchain/index')
const Wallet = require('./wallet')
const bc = new Blockchain()

const wallet = new Wallet()

console.log(wallet.toString())