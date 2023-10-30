<h1 align="center">flagscan-node</h1>

# Hardware requirements
```
Minimum system requirements
    RAM: 16 GB
    CPU: 4-core
    Storage: 2 TB SSD

Recommended system requirements
    RAM: 32 GB
    CPU: 8-core
    Storage: 4 TB SSD
```

# OS requirements
```
    ubuntu 22.04
```

# Install GETH
```
    sudo add-apt-repository -y ppa:ethereum/ethereum
    sudo apt-get update
    sudo apt-get install ethereum
    geth version

        ```````````````````
        Geth
        Version: 1.13.4-stable
        Git Commit: 3f907d6a6f6de09cff1360ed529126765939851d
        Architecture: amd64
        Go Version: go1.21.3
        Operating System: linux
        GOPATH=
        GOROOT=
        ````````````````````
```

# Create new Account
```
    cd ~
    mkdir flagscan-node
    cd flagscan-node

    echo "*******" > password.txt
        ( ******* is the password for your encrypt account )
        ( ex: echo "mypassword" > password.txt )

    geth --datadir node-data/ account new --password password.txt

        ``````````````````````````````````````
        Your new key was generated

        Public address of the key:   0x20429C8083Da9fC86Bd7165756A6688b20Ab5045
        Path of the secret key file: node-data/keystore/UTC--2023-10-29T13-09-13.631778498Z--20429c8083da9fc86bd7165756a6688b20ab5045
        ``````````````````````````````````````
```
# Get PrivateKey from keystore file
```
    --  Install NodeJS

        install nvm
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
            source ~/.bashrc
            nvm --version
                0.39.3

        install node
            nvm install v16.14.0
            node --version
                v16.14.0
            npm --version
                9.8.1

    -- get private key of your new account from keystore file

        cd ~/flagscan-node
        mkdir acc
        cd acc
        npm init -y
        npm install web3@1.9.0 readline-sync
        sudo nano index.js
            ( copy source code: acc/index.js )
        
        cd ~/flagscan-node/node-data/keystore

        ls
            UTC--2023-10-29T13-09-13.631778498Z--20429c8083da9fc86bd7165756a6688b20ab5045
                ( keystore file name )
        
        cd ~/flagscan-node/acc
        node index.js

            ````````````````````````````````````````````````````````````````````````````
            encrypt account password? *********
            keystore file path:/root/flagscan-node/node-data/keystore/UTC--2023-10-29T13-09-13.631778498Z--20429c8083da9fc86bd7165756a6688b20ab5045
            0x20429C8083Da9fC86Bd7165756A6688b20Ab5045
            Do you want to show privateKey ? [y/n]:y
            0x2f1e75*******************************************************
            ````````````````````````````````````````````````````````````````````````````
```

# Import account to metamask wallet using privateKey and stake Flag token
```
        stake flag token
            ( https://validators.flagscan.io/ )
```

# Create and init genesis.json
```
    cd ~/flagscan-node
    sudo nano genesis.json
        ( source: 
            for mainnet: /genesis/mainnet/genesis.json
            for testnet: /genesis/testnet/genesis.json )

    geth --datadir node-data/ init genesis.json
```

# for Mainnet
## Running node for test
```
    ( replace <ip address> and <account address> )
    ( ex: 143.110.161.243 and 0x20429C8083Da9fC86Bd7165756A6688b20Ab5045 )

    geth --datadir node-data --port 25850 \
    --syncmode 'full' --gcmode "archive" \
    --http --http.addr 0.0.0.0 --http.port 45850 --http.api debug,net,eth,web3,txpool --http.vhosts "*" \
    --ws --ws.addr 0.0.0.0 --ws.port 45851 --ws.api "eth,net,web3,debug,txpool" --ws.origins "*" \
    --authrpc.port 35850 \
    --bootnodes 'enode://2ca5f89fb5bc71f5ddcfc0433f0e0e7f55020ae893def3409c9ba2c51d39cc04c30bda6ad77c8c2b0cd82b513924ed85e69165e8185b37e3819936f8ebcfafe3@75.101.250.25:25850' \
    --networkid 220 --nat extip:143.110.161.243 \
    --allow-insecure-unlock --unlock '0x20429C8083Da9fC86Bd7165756A6688b20Ab5045' \
    --password password.txt \
    --rpc.allow-unprotected-txs --rpc.txfeecap 0

    ( wait until there is the message <Imported new chain segment> )
```
## Make service for ubuntu
```
    sudo nano /etc/systemd/system/flag-node.service

    `````````````````````````````````````````````
    [Unit]
    Description=Flag-testnet validator service
    After=network.target
    StartLimitIntervalSec=1
    [Service]
    Type=simple
    User=root
    ExecStart=geth --datadir /root/flagscan-node/node-data/ --port 25850 \
    --syncmode 'full' --gcmode "archive" \
    --http --http.addr 0.0.0.0 --http.port 45850 --http.api debug,net,eth,web3,txpool --http.vhosts "*" \
    --ws --ws.addr 0.0.0.0 --ws.port 45851 --ws.api "eth,net,web3,debug,txpool" --ws.origins "*" \
    --authrpc.port 35850 \
    --bootnodes 'enode://2ca5f89fb5bc71f5ddcfc0433f0e0e7f55020ae893def3409c9ba2c51d39cc04c30bda6ad77c8c2b0cd82b513924ed85e69165e8185b37e3819936f8ebcfafe3@75.101.250.25:25850' \
    --networkid 220 --nat extip:143.110.161.243 \
    --allow-insecure-unlock --unlock '0x20429C8083Da9fC86Bd7165756A6688b20Ab5045' \
    --password /root/flagscan-node/password.txt \
    --rpc.allow-unprotected-txs --rpc.txfeecap 0

    [Install]
    WantedBy=multi-user.target
    `````````````````````````````````````````````

    cd ~
    sudo systemctl daemon-reload
    sudo systemctl enable flag-node.service
    sudo systemctl disable flag-node.service

    sudo systemctl start flag-node.service
    sudo systemctl status flag-node.service
    sudo systemctl stop flag-node.service
    sudo journalctl -fu flag-node.service    
```

# for Testnet
## Running node for test
```
    ( replace <ip address> and <account address> )
    ( ex: 143.110.161.243 and 0x20429C8083Da9fC86Bd7165756A6688b20Ab5045 )

    geth --datadir node-data --port 25850 \
    --syncmode 'full' --gcmode "archive" \
    --http --http.addr 0.0.0.0 --http.port 45850 --http.api debug,net,eth,web3,txpool --http.vhosts "*" \
    --ws --ws.addr 0.0.0.0 --ws.port 45851 --ws.api "eth,net,web3,debug,txpool" --ws.origins "*" \
    --authrpc.port 35850 \
    --bootnodes 'enode://da0c69cdc0b35b2e9e7448f6a118b9efa90a88116995449eb8b682c0b79f5c8a146186ba45312049b0283bc942e245b484f900d681b13e3c5de27d01341894da@3.95.252.204:25850' \
    --networkid 1220 --nat extip:143.110.161.243 \
    --allow-insecure-unlock --unlock '0x20429C8083Da9fC86Bd7165756A6688b20Ab5045' \
    --password password.txt \
    --rpc.allow-unprotected-txs --rpc.txfeecap 0

        ( wait until there is the message <Imported new chain segment> )
```
## Make service for ubuntu
```
    sudo nano /etc/systemd/system/flag-node.service

    `````````````````````````````````````````````
    [Unit]
    Description=Flag-testnet validator service
    After=network.target
    StartLimitIntervalSec=1
    [Service]
    Type=simple
    User=root
    ExecStart=geth --datadir /root/flagscan-node/node-data/ --port 25850 \
    --syncmode 'full' --gcmode "archive" \
    --http --http.addr 0.0.0.0 --http.port 45850 --http.api debug,net,eth,web3,txpool --http.vhosts "*" \
    --ws --ws.addr 0.0.0.0 --ws.port 45851 --ws.api "eth,net,web3,debug,txpool" --ws.origins "*" \
    --authrpc.port 35850 \
    --bootnodes 'enode://da0c69cdc0b35b2e9e7448f6a118b9efa90a88116995449eb8b682c0b79f5c8a146186ba45312049b0283bc942e245b484f900d681b13e3c5de27d01341894da@3.95.252.204:25850' \
    --networkid 1220 --nat extip:143.110.161.243 \
    --allow-insecure-unlock --unlock '0x20429C8083Da9fC86Bd7165756A6688b20Ab5045' \
    --password /root/flagscan-node/password.txt \
    --rpc.allow-unprotected-txs --rpc.txfeecap 0

    [Install]
    WantedBy=multi-user.target
    `````````````````````````````````````````````

    cd ~
    sudo systemctl daemon-reload
    sudo systemctl enable flag-node.service
    sudo systemctl disable flag-node.service

    sudo systemctl start flag-node.service
    sudo systemctl status flag-node.service
    sudo systemctl stop flag-node.service
    sudo journalctl -fu flag-node.service
```

# Check chain status
```
    cd ~/flagscan-node
    geth attach ~/flagscan-node/node-data/geth.ipc
    >admin.nodeInfo

    ``````````````````````````````````````````````````````````````````````````````````````````````````````````
    {
        enode: "enode://21dd473ec6fa2e2174d4ea375ac35ba0c5799cabc2cd32d87b2abfa6358d94a8a06e38b15f65d7b184
        enr: "enr:-KO4QFwj5ypDxxi3MqP8zZ_8DsH63wyfX6D6amAZTFY-sM_GaZ2fkcPY0U55nL4zOh3BqfxyN4fc86Nc4B2Pnq48
        U6jdaw1ugxXmcq8LNMth7Kr-mNY2UqIRzbmFwwIN0Y3CCZPqDdWRwgmT6",
        id: "16d3ebaf68de581c58d913249cb8d3b9e9e5db1ede5a1effd4a81a88c24367fd",
        ip: "143.110.161.243",
        listenAddr: "[::]:25850",
        name: "Geth/v1.13.4-stable-3f907d6a/linux-amd64/go1.21.3",
        ports: {
            discovery: 25850,
            listener: 25850
        },
        protocols: {
            eth: {
            config: {
                byzantiumBlock: 0,
                chainId: 220,
                clique: {...},
                constantinopleBlock: 0,
                eip150Block: 0,
                eip155Block: 0,
                eip158Block: 0,
                homesteadBlock: 0,
                istanbulBlock: 0,
                petersburgBlock: 0
            },
            difficulty: 18909,
            genesis: "0x1a3300913bb874b9c1aeab86e3158bd27697dec9ae32b173f7e9f2b3bb895b66",
            head: "0x2ae247e9a57fd5436cec4265a295bcbc0f002ccf4f3fd5313640e42f41c16e08",
            network: 220
            },
            snap: {}
        }
    }
    ``````````````````````````````````````````````````````````````````````````````````````````````````````````

```

# Server url
```
http://143.110.161.243:45850

ws://143.110.161.243:45851
```

