const ChainUtil = require('./chain-util')
const { DIFFICULTY, MINE_RATE } = require('./config')

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.data = data
        this.hash = hash
        this.nonce = nonce
        this.difficulty = difficulty || DIFFICULTY // or for genesis
    }

    toString() {
        return `Block - 
            Timestamps: ${this.timestamp}
            Last-hash: ${this.lastHash.substring(0,10)}
            Hash: ${this.hash.substring(0,10)}
            Data: ${this.data}`
    }

    static genesis() {
        return new this('genesisTime','------','fiam2321-!nda',[], 0, DIFFICULTY)
    }

    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash
        let hash, timestamp
        let nonce = 0
        let { difficulty } = lastBlock
        do {
            nonce++
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty(lastBlock, timestamp)
            hash = this.hashBlock(timestamp, lastHash, data, nonce, difficulty)
        } while (hash.substring(0,difficulty) != '0'.repeat(difficulty))
        return new this(timestamp,lastHash,hash,data, nonce, difficulty)
    }

    static hashBlock(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString()
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block
        return Block.hashBlock(timestamp,lastHash,data, nonce, difficulty)
    }

    static adjustDifficulty(lastBlock, currTime) {
        let {difficulty} = lastBlock
        difficulty = lastBlock.timestamp + MINE_RATE > currTime ? difficulty + 1 : difficulty - 1
        return difficulty
    }
}

module.exports = Block