 const Block = require('../block')

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock(data) {
        const lastBlock = this.chain[this.chain.length-1]
        const block = Block.mineBlock(lastBlock,data)
        this.chain.push(block)
        return block
    }

    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false
        }
        for (let i=1;i<chain.length;i++) {
            const block = chain[i]
            const lastBlock = chain[i-1]
            if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
                return false
            }
        }
        return true
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            return console.log('received chain is shorter than current')
        }
        if (!this.isValidChain(newChain)) {
            return console.log('received chain invalid')
        }
        this.chain = newChain
        return console.log('replaced blockchain with the new chain')
    }
}

module.exports = Blockchain