# BLOCKCHAIN BASED CURRENCY (PROOF OF WORK MODEL)

## SETUP
Install dependencies by executing `npm install`. <br/>
The blockchain works on multiple nodes. One can simulate it by running different instances of the application on different terminals (2 terminal sessions should be enough to get started).<br/>
To start an instance of the application on a terminal, we need to pass in 2 port values. One HTTP port and one P2P port, both being different. The port values for the next terminal session should be different from the port values of the first terminal session.
We also need to pass in the web-socket address of the peers in the node in the format given below.<br/></br>

Terminal-1 <br/>
```
HTTP_PORT=3000 P2P_PORT=5000 npm run start
```
Now for terminal-2 the terminal-1 acts as a peer. So we need to provide that information to terminal-2.<br/>

Terminal-2 <br/>
```
HTTP_PORT=3001 P2P_PORT=5001 PEERS=ws://localhost:5000 npm run start
```
For terminal-3 terminal-1 and terminal-2 are the available peers. So we provide that information. <br/>

Terminal-3 <br/>
```
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5000,ws://localhost:5001 npm run start
```

In case the websocket address is not local, replace *ws* by *wss* and *localhost* by the peer server's address, followed by the port on which it listens to. Example - <br/>
```
npm run start HTTP_PORT=3001 P2P_PORT=5001 PEERS=wss://192.168.29.50:5000
```
In the above example the ipv4 address of the peer web-socket is 192.168.29.50 and it listens on port 5000. <br/><br/><br/><br/>


## REQUESTS
Use tools such as Postman for making HTTP requests. <br/><br/>

### GET BLOCKCHAIN
---
Returns the blockchain

* **URL** <br/>
`/blocks`

* **METHOD** <br/>
`GET`

* **Success Response:**

  * **Code:** 200 <br />
    **Example Content:** ```[
    {
        "timestamp": "genesisTime",
        "lastHash": "------",
        "data": [],
        "hash": "fiam2321-!nda",
        "nonce": 0,
        "difficulty": 4
    }
]```
<br/><br/><br/>

### GET TRANSACTIONS
---
Returns the transactions from the transaction-pool

* **URL** <br/>
`/transactions`

* **METHOD** <br/>
`GET`

* **Success Response:**

  * **Code:** 200 <br />
    **Example Content:** ```
    [
    {
        "id": "b5b39c00-05b1-11ec-83f3-aba4de334ffc",
        "input": {
            "timestamp": 1629902175104,
            "amount": 500,
            "address": "04c7aac476376bf958f7494a3e789c54d6a143360917dcd49f6a5baae9c9730aef0af69b3180a086d846a9316f24a5cb83dee0129a4796b1af47307ba035c0de60",
            "signature": {
                "r": "9057d0a9cf5b3cd3cc77d1cd408bd15c09b82505bdff1f22f6f68a5da89e0140",
                "s": "c7b86f2566c8eb18e877cdf44cd04a32c7064e754272aec4d056fcf3fd8d76a9",
                "recoveryParam": 0
            }
        },
        "outputs": [
            {
                "amount": 400,
                "address": "04c7aac476376bf958f7494a3e789c54d6a143360917dcd49f6a5baae9c9730aef0af69b3180a086d846a9316f24a5cb83dee0129a4796b1af47307ba035c0de60"
            },
            {
                "amount": 50,
                "address": "04933df46b736c32915bd9a82e5600fe32ba09b685ff3a6393e52a66afa6442891cd439b6351bf2d427940ce3805bfae6d05600a59a264a4dd20573eeb52f1dc9c"
            },
            {
                "amount": 50,
                "address": "04933df46b736c32915bd9a82e5600fe32ba09b685ff3a6393e52a66afa6442891cd439b6351bf2d427940ce3805bfae6d05600a59a264a4dd20573eeb52f1dc8d"
            }
        ]
    }
]```
<br/><br/><br/>

### GET PUBLIC KEY
---
Returns the public-key (wallet-address)

* **URL** <br/>
`/public-key`

* **METHOD** <br/>
`GET`

* **Success Response:**

  * **Code:** 200 <br />
    **Example Content:** ```{
    "publicKey": "04c7aac476376bf958f7494a3e789c54d6a143360917dcd49f6a5baae9c9730aef0af69b3180a086d846a9316f24a5cb83dee0129a4796b1af47307ba035c0de60"
}```
<br/><br/><br/>

### MINE TRANSACTIONS
---
Mine the transactions currently in the transaction-pool

* **URL** <br/>
`/mine-transactions`

* **METHOD** <br/>
`GET`

* **Success Response:**

  * **Code:** 200 <br />
    **Returned object:** Block that was mined <br/>
    **Example Content:** ```[
    {
        "timestamp": "genesisTime",
        "lastHash": "------",
        "data": [],
        "hash": "fiam2321-!nda",
        "nonce": 0,
        "difficulty": 4
    },
    {
        "timestamp": 1629903452206,
        "lastHash": "fiam2321-!nda",
        "data": [
            {
                "id": "b5b39c00-05b1-11ec-83f3-aba4de334ffc",
                "input": {
                    "timestamp": 1629902175104,
                    "amount": 500,
                    "address": "04c7aac476376bf958f7494a3e789c54d6a143360917dcd49f6a5baae9c9730aef0af69b3180a086d846a9316f24a5cb83dee0129a4796b1af47307ba035c0de60",
                    "signature": {
                        "r": "9057d0a9cf5b3cd3cc77d1cd408bd15c09b82505bdff1f22f6f68a5da89e0140",
                        "s": "c7b86f2566c8eb18e877cdf44cd04a32c7064e754272aec4d056fcf3fd8d76a9",
                        "recoveryParam": 0
                    }
                },
                "outputs": [
                    {
                        "amount": 400,
                        "address": "04c7aac476376bf958f7494a3e789c54d6a143360917dcd49f6a5baae9c9730aef0af69b3180a086d846a9316f24a5cb83dee0129a4796b1af47307ba035c0de60"
                    },
                    {
                        "amount": 50,
                        "address": "04933df46b736c32915bd9a82e5600fe32ba09b685ff3a6393e52a66afa6442891cd439b6351bf2d427940ce3805bfae6d05600a59a264a4dd20573eeb52f1dc9c"
                    },
                    {
                        "amount": 50,
                        "address": "04933df46b736c32915bd9a82e5600fe32ba09b685ff3a6393e52a66afa6442891cd439b6351bf2d427940ce3805bfae6d05600a59a264a4dd20573eeb52f1dc8d"
                    }
                ]
            },
            {
                "id": "c65898f0-05b4-11ec-83f3-aba4de334ffc",
                "input": {
                    "timestamp": 1629903452159,
                    "amount": 500,
                    "address": "04c795a4968bf157d546112c4f44f0cdb755c2aa7abbba1433776855be5dccf120885429075c0c6d9cdd66bb26c8869e01db32d6ba046f8adcb655b9b5d600a779",
                    "signature": {
                        "r": "4862d67dea94c9b6243eb3f79b575b1ee56270b2fbe9bcea59032490d48de699",
                        "s": "ec448377d952c3f5f0b8765188015fc9001ea3ccf9ace82524f0017ca17e947c",
                        "recoveryParam": 0
                    }
                },
                "outputs": [
                    {
                        "amount": 50,
                        "address": "04c7aac476376bf958f7494a3e789c54d6a143360917dcd49f6a5baae9c9730aef0af69b3180a086d846a9316f24a5cb83dee0129a4796b1af47307ba035c0de60"
                    }
                ]
            }
        ],
        "hash": "0005b9e25c0ef084a36696d99cf412e9caacb5a8bc8ac6a61fd5f3048a9e95d2",
        "nonce": 1420,
        "difficulty": 3
    }
]```
<br/><br/><br/>

### MAKE A TRANSACTION
---
Makes a new transaction and adds it to the transaction-pool

* **URL** <br/>
`/mine-transactions`

* **METHOD** <br/>
`POST`

*  **Body Params**

   **Required:**<br/>```
      recipient=[SHA256]```
      ```amount=[Number]```
    
* **Example Body**
  ```{"recipient": "04933df46b736c32915bd9a82e5600fe32ba09b685ff3a6393e52a66afa6442891cd439b6351bf2d427940ce3805bfae6d05600a59a264a4dd20573eeb52f1dc8d","amount": 50}```

* **Success Response:**

  * **Code:** 200 <br />
    **Returned object:** Block of transaction <br/>
    **Example Content:** ```
    [
    {
        "id": "b5b39c00-05b1-11ec-83f3-aba4de334ffc",
        "input": {
            "timestamp": 1629902175104,
            "amount": 500,
            "address": "04c7aac476376bf958f7494a3e789c54d6a143360917dcd49f6a5baae9c9730aef0af69b3180a086d846a9316f24a5cb83dee0129a4796b1af47307ba035c0de60",
            "signature": {
                "r": "9057d0a9cf5b3cd3cc77d1cd408bd15c09b82505bdff1f22f6f68a5da89e0140",
                "s": "c7b86f2566c8eb18e877cdf44cd04a32c7064e754272aec4d056fcf3fd8d76a9",
                "recoveryParam": 0
            }
        },
        "outputs": [
            {
                "amount": 400,
                "address": "04c7aac476376bf958f7494a3e789c54d6a143360917dcd49f6a5baae9c9730aef0af69b3180a086d846a9316f24a5cb83dee0129a4796b1af47307ba035c0de60"
            },
            {
                "amount": 50,
                "address": "04933df46b736c32915bd9a82e5600fe32ba09b685ff3a6393e52a66afa6442891cd439b6351bf2d427940ce3805bfae6d05600a59a264a4dd20573eeb52f1dc9c"
            },
            {
                "amount": 50,
                "address": "04933df46b736c32915bd9a82e5600fe32ba09b685ff3a6393e52a66afa6442891cd439b6351bf2d427940ce3805bfae6d05600a59a264a4dd20573eeb52f1dc8d"
            }
        ]
    }
]```
<br/><br/><br/>
