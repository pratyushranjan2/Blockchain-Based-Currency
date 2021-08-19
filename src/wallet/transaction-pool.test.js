const TransactionPool = require('./transaction-pool')
const Transaction = require('./transaction')
const Wallet = require('./index')
const Blockchain = require('../blockchain')

describe('Transaction-Pool', () => {
    let tp, wallet, transaction, bc
    beforeEach(() => {
        tp = new TransactionPool()
        wallet = new Wallet()
        bc = new Blockchain()
        transaction = wallet.createTransaction('r4nfj45-24fa', 30, tp, bc)
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

    it('clears transactions in pool', () => {
        tp.clear()
        expect(tp.transactions).toEqual([])
    })

    describe('mixing valid and corrupt transactions', () => {
        let validTransactions

        beforeEach(() => {
            validTransactions = [...tp.transactions]
            for (let i=0;i<6;i++) {
                wallet = new Wallet()
                transaction = wallet.createTransaction('r42fds-24da',30,tp,bc)
                if (i % 2 == 0) {
                    transaction.input.amount = 9999
                }
                else {
                    validTransactions.push(transaction)
                }
            }
        })

        it('Shows a difference between valid and corrupt transactions', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions))
        })

        it('Grabs valid transactions', () => {
            expect(tp.validTransactions()).toEqual(validTransactions)
        })
    })
})