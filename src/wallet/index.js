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

    createTransaction(recipient, amount, transactionPool, blockchain) {
        this.balance = this.calculateBalance(blockchain)
        
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

    calculateBalance(blockchain) {
        let balance = this.balance
        let transactions = []
        blockchain.chain.forEach((block) => block.data.forEach((transaction) => {
            transactions.push(transaction)
        }))
        let walletInputTs = transactions.filter(transaction => transaction.input.address == this.publicKey)
        let startTime = 0
        if (walletInputTs.length > 0) {
            let recentInputT = walletInputTs.reduce((prev,curr) => prev.input.timestamp > curr.input.timestamp ? prev : curr)
            startTime = recentInputT.input.timestamp
            balance = recentInputT.outputs.find((output) => output.address == this.publicKey).amount
        }
        transactions.forEach(transaction => {
            if (transaction.input.timestamp > startTime) {
                transaction.outputs.find(output => {
                    if (output.address == this.publicKey) {
                        balance += output.amount
                    }
                })
            }
        })
        return balance
    }

    static blockchainWallet() {
        const blockchainWallet = new this()
        blockchainWallet.address = 'blockchain-wallet'
        return blockchainWallet
    }
}

module.exports = Wallet