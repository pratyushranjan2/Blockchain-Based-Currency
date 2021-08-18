const TransactionPool = require('./transaction-pool')
const Transaction = require('./transaction')
const Wallet = require('./index')

describe('Transaction-Pool', () => {
    let tp, wallet, transaction
    beforeEach(() => {
        tp = new TransactionPool()
        wallet = new Wallet()
        transaction = Transaction.newTransaction(wallet, 'r4nfj45-24fa', 30)
        tp.updateOrAddTransactions(transaction)
    })

    it('Adds a transaction to the pool', () => {
        expect(tp.transactions.find((t) => t.id == transaction.id)).toEqual(transaction)
    })

    it('Updates a transaction in the pool', () => {
        let oldTransaction = JSON.stringify(transaction)
        let newTransaction = transaction.update(wallet, 'godis-thor45', 40)
        tp.updateOrAddTransactions(newTransaction)

        expect(JSON.stringify(tp.transactions.find((t) => t.id == transaction.id))).not.toEqual(oldTransaction)
    })
})