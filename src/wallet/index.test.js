const Wallet = require('./index')
const TransactionPool = require('./transaction-pool')

describe('Wallet', () => {
    let wallet, tp
    
    beforeEach(() => {
        wallet = new Wallet()
        tp = new TransactionPool()
    })

    describe('Create a transaction', () => {
        let transaction, sendAmount, recipient

        beforeEach(() => {
            sendAmount = 50
            recipient = 'ndn394umn-3sa'
            transaction = wallet.createTransaction(recipient, sendAmount, tp)
        })

        describe('doing the same transaction',() => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp)
            })

            it('doubles the sendAmount substracted from wallet balance', () => {
                expect(transaction.outputs.find((output) => output.address == wallet.publicKey).amount).toEqual(wallet.balance-2*sendAmount)
            })

            it('Clones the sendAmount output for the recipient', () => {
                expect(transaction.outputs.filter((output) => output.address == recipient).map(output => output.amount)).toEqual([sendAmount,sendAmount])
            })
        })
    })
})