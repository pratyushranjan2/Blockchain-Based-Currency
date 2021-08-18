const Websocket = require('ws')
const P2P_PORT = process.env.P2P_PORT || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
const MESSAGE_TYPES = {
    chain: "CHAIN",
    transaction: "TRANSACTION"
}

class P2pServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain
        this.sockets = []
        this.transactionPool = transactionPool
    }

    listen() {
        const server = new Websocket.Server({ port: P2P_PORT })
        server.on('connection', (socket) => this.connectSocket(socket))
        this.connectToPeers()
        console.log('Listening to peers to peers on '+P2P_PORT)
    }

    connectToPeers() {
        peers.forEach((peer) => {
            // ws://localhost:5001
            // after ws, address of the peer is provided
            const socket = new Websocket(peer)
            socket.on('open', () => this.connectSocket(socket))
        })
    }

    connectSocket(socket) {
        this.sockets.push(socket)
        console.log('Socket connected')
        this.messageHandler(socket)
        this.sendChain(socket)
    }

    messageHandler(socket) {
        socket.on('message', (msg) => {
            const data = JSON.parse(msg)
            switch(data.type) {
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain)
                    break
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransactions(data.transaction)
                    break
            }
        })
    }

    sendChain(socket) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        }))
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            transaction
        }))
    }

    syncChains() {
        this.sockets.forEach((socket) => {
            this.sendChain(socket)
        })
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach((socket) => this.sendTransaction(socket, transaction))
    }
}

module.exports = P2pServer