const Blockchain = require('./index')
const Block = require('../block')

describe('Blockchain', () => {
    let bc
    beforeEach(() => {
        bc = new Blockchain()
        bc2 = new Blockchain()
    })

    it('start wtih genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis())
    })

    it('adds a new block', () => {
        const data = 'foo'
        bc.addBlock(data)
        expect(bc.chain[bc.chain.length-1].data).toEqual(data)
    })

    it('validates a valid chain', () => {
        bc2.addBlock('foo')
        expect(bc.isValidChain(bc2.chain)).toBe(true)
    })

    it('invalidates a chain with corrupt genesis block', () => {
        bc2.chain[0].data = 'bad-data'
        expect(bc.isValidChain(bc2.chain)).toBe(false)
    })

    it('invalidates a corrupt chain', () => {
        bc2.addBlock('foo');
        bc.chain = bc2.chain
        bc2.chain[1].data = 'not foo'
        expect(bc.isValidChain(bc2.chain)).toBe(false)
    })

    it('replaces the chain with a valid chain', () => {
        bc2.addBlock('gui')
        bc.replaceChain(bc2.chain)
        expect(bc.chain).toEqual(bc2.chain)
    })

    it('rejects the chain with chain length less than original', () => {
        bc.addBlock('foo')
        bc.replaceChain(bc2.chain)
        expect(bc.chain).not.toEqual(bc2.chain)
    })
})