const Transaction = require('../wallet/transaction')
const Wallet = require('../wallet')

class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.wallet = wallet
        this.p2pServer = p2pServer
    }

    mine() {
        const validTransactions = this.transactionPool.validTransactions()
        // include a reward
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()))
        // create a block consisting of valid transactions
        const block = this.blockchain.addBlock(validTransactions)
        // block is undefined if it was mined by some other miner 
        // faster than this miner
        if (block) {
            // synchronise the chains in the p2p server
            this.p2pServer.syncChains()
            // broadcast to al iner to clear their as well
            this.p2pServer.broadcastClearTransactions()
        }
        // clear the transaction pool local to this miner
        this.transactionPool.clear() 
        return block
    }
}

module.exports = Miner