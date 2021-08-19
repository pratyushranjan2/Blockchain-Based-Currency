const Wallet = require('./index')
const TransactionPool = require('./transaction-pool')
const Blockchain = require('../blockchain')
const { INITIAL_BALANCE } = require('../config')

describe('Wallet', () => {
    let wallet, tp, bc
    
    beforeEach(() => {
        wallet = new Wallet()
        tp = new TransactionPool()
        bc = new Blockchain()
    })

    describe('Create a transaction', () => {
        let transaction, sendAmount, recipient

        beforeEach(() => {
            sendAmount = 50
            recipient = 'ndn394umn-3sa'
            transaction = wallet.createTransaction(recipient, sendAmount, tp, bc)
        })

        describe('doing the same transaction',() => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp, bc)
            })

            it('doubles the sendAmount substracted from wallet balance', () => {
                expect(transaction.outputs.find((output) => output.address == wallet.publicKey).amount).toEqual(wallet.balance-2*sendAmount)
            })

            it('Clones the sendAmount output for the recipient', () => {
                expect(transaction.outputs.filter((output) => output.address == recipient).map(output => output.amount)).toEqual([sendAmount,sendAmount])
            })
        })
    })

    describe('calculating balance', () => {
        let addBalance, repeatAdd, senderWallet

        beforeEach(() => {
            senderWallet = new Wallet()
            addBalance = 100
            repeatAdd = 3
            for (let i=0;i<repeatAdd;i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance, tp, bc)
            }
            bc.addBlock(tp.transactions)
        })

        it('Calculates the balance for the blockchain transactions matching the recipient', () => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE+(addBalance*repeatAdd))
        })

        it('Calculates the balance for the blockchain transactions matching the sender', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE-(addBalance*repeatAdd))
        })

        describe('Recipient conducts a transaction', () => {
            let substractBalance, recipientBalance
        
            beforeEach(() => {
                tp.clear()
                substractBalance = 60
                recipientBalance = wallet.calculateBalance(bc)
                wallet.createTransaction(senderWallet.publicKey, substractBalance, tp, bc)
                bc.addBlock(tp.transactions)
            })

            // it('debug', () => {
            //     expect(wallet.calculateBalance(bc)).toEqual(recipientBalance-substractBalance)
            // })

            describe('Sender sends another transaction to the recipient', () => {
                beforeEach(() => {
                    tp.clear()
                    senderWallet.createTransaction(wallet.publicKey, addBalance, tp, bc)
                    bc.addBlock(tp.transactions)
                })

                it('Calculates the recipient balance only using transactions since it most recent one', () => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance-substractBalance+addBalance)
                })
            })
        })
    })
})