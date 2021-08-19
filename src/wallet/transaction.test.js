const Transaction = require('./transaction')
const Wallet = require('./index')
const { MINING_REWARD } = require('../config')


describe('Transaction', () => {
    let transaction, wallet, recipient, amount
    
    beforeEach(() => {
        wallet = new Wallet()
        amount = 50
        recipient = 'r3c1p8dn42c'
        transaction = Transaction.newTransaction(wallet, recipient, amount)
    })

    it('Outputs the amount substracted from the wallet balance', () => {
        expect(transaction.outputs.find((output) => output.address == wallet.publicKey).amount)
            .toEqual(wallet.balance - amount)
    })

    it('Outputs the amount added to the recipient', () => {
        expect(transaction.outputs.find((output) => output.address == recipient).amount)
            .toEqual(amount)
    })

    it('Inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance)
    })

    it('Validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true)
    })

    it('Invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = 50000
        expect(Transaction.verifyTransaction(transaction)).toBe(false)
    })

    describe('Updating a transaction', () => {
        let nextAmount, nextRecipient
        beforeEach(() => {
            nextAmount = 20,
            nextRecipient = 'n3xt-4ddr355'
            transaction = transaction.update(wallet, nextRecipient, nextAmount)
        })

        it(`Next amount is substracted from the sender's output`, () => {
            expect(transaction.outputs.find((output) => output.address == wallet.publicKey).amount)
                .toEqual(wallet.balance-amount-nextAmount)
        })

        it('outputs the amount for the next recipient', () => {
            expect(transaction.outputs.find((output) => output.address == nextRecipient).amount)
                .toEqual(nextAmount)
        })
    })

    describe('Amount exceeds balance', () => {
        beforeEach(() => {
            amount = 50000
            transaction = Transaction.newTransaction(wallet, recipient, 50000)
        })
    
        it('does not create a transaction', () => {
            expect(transaction).toEqual(undefined)
        })
    })

    describe('Creating a reward transaction', () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet())
        })

        it(`reward the miner's wallet`, () => {
            expect(transaction.outputs.find((output) => output.address == wallet.publicKey).amount).toEqual(MINING_REWARD)
        })
    })
})