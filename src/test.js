const Block = require('./block')

const block = new Block('foo','bar','zoo','tar')

console.log(block)
console.log(Block.genesis())
console.log(Block.mineBlock(Block.genesis(),'foo'))