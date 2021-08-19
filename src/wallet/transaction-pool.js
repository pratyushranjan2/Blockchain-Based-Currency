const Transaction = require('./transaction')

class TransactionPool {
    constructor() {
        this.transactions = []
    }

    updateOrAddTransactions(transaction) {
        let transactionWithId = this.transactions.find((t) => transaction.id == t.id)
        if (transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction
        }
        else {
            this.transactions.push(transaction)
        }
    }

    existingTransaction(address) {
        return this.transactions.find((t) => t.input.address == address)
    }

    validTransactions() {
        return this.transactions.filter((transaction) => {
            const outputTotal = transaction.outputs.reduce((total,output) => {
                return total + output.amount
            }, 0)
            if (transaction.input.amount != outputTotal) {
                console.log(`Invalid transaction/s from ${transaction.input.address}`)
                return false
            }
            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.input.address}`)
                return false
            }
            return true
        })
    }

    clear() {
        this.transactions = []
    }
}

module.exports = TransactionPool