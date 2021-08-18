const express = require('express')
const Blockchain = require('../blockchain/index')
const bodyparser = require('body-parser')
const P2pServer = require('./p2p-server')
const Wallet = require('../wallet')
const TransactionPool = require('../wallet/transaction-pool')

const HTTP_PORT = process.env.HTTP_PORT || 3001

const app = express()
app.use(bodyparser.json())

const bc = new Blockchain()
const tp = new TransactionPool()
const p2pServer = new P2pServer(bc,tp)
const wallet = new Wallet()

app.get('/blocks', (req,res) => {
    res.json(bc.chain)
})

app.post('/mine', (req,res) => {
    const block = bc.addBlock(req.body.data)
    p2pServer.syncChains()
    res.redirect('/blocks')
})

app.get('/transactions', (req,res) => {
    res.json(tp.transactions)
})

app.post('/transact', (req,res) => {
    const { recipient, amount } = req.body
    const transaction = wallet.createTransaction(recipient, amount, tp)
    p2pServer.broadcastTransaction(transaction)
    res.redirect('/transactions')
})

app.get('/public-key', (req,res) => {
    res.json({ publicKey: wallet.publicKey })
})

app.listen(HTTP_PORT, () => {
    console.log('Server up on '+HTTP_PORT)
})

p2pServer.listen()