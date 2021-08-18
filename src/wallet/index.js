const { INTIAL_BALANCE, INITIAL_BALANCE } = require('../config')
const Transaction = require('./transaction')
const ChainUtil = require('../chain-util')

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE
        this.keyPair = ChainUtil.genKeyPair()
        this.publicKey = this.keyPair.getPublic().encode("hex")
    }

    toString() {
        return `Wallet - 
        balance: ${this.balance}
        public key: ${this.publicKey.toString()}`
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash)
    }

    createTransaction(recipient, amount, transactionPool) {
        if (amount > this.balance) {
            return console.log(`Amount ${amount} exceeds the balance`)
        }
        let transaction = transactionPool.existingTransaction(this.publicKey)
        if (transaction) {
            transaction.update(this, recipient, amount)
        }
        else {
            transaction = Transaction.newTransaction(this, recipient, amount)
            transactionPool.updateOrAddTransactions(transaction)
        }
        return transaction
    }
}

module.exports = Wallet