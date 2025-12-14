const express = require('express');
const { Web3 } = require('web3'); 
const abi = require('./MyContractAbi.json');
const path = require('path');
const cors = require("cors")

const app = express();
const PORT = 3000;

const address = "0x3532EcFB809e338fF1599021BcD2a9E5B75F61e6";
const web3 = new Web3("HTTP://127.0.0.1:7545");
const pk = "";
const contractAddress = "0x6B1d7A2F11B998c77c8854C2dB0E26664A176a5A";

app.use(express.json());
app.use(cors())


// Basic Call - Check Balance
app.get('/api/checkBalance', async (req, res) => {
    try {
        const balance = await web3.eth.getBalance(address);
        const balanceEth = web3.utils.fromWei(balance, 'ether');
        
        res.json({
            success: true,
            address: address,
            balanceWei: balance.toString(),
            balanceEth: balanceEth
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send ETH
app.post('/api/sendEth', async (req, res) => {
    try {
        const { receiverAddress, amount } = req.body;

        const account = web3.eth.accounts.privateKeyToAccount(pk);
        
        const receipt = await web3.eth.sendTransaction({
            from: account.address,
            to: receiverAddress,
            value: web3.utils.toWei(amount.toString(), "ether"),
        });

        // Check balances after transaction
        const senderBalance = await web3.eth.getBalance(account.address);
        const receiverBalance = await web3.eth.getBalance(receiverAddress);
        
        res.json({
            success: true,
            transactionHash: receipt.transactionHash,
            from: account.address,
            to: receiverAddress,
            amount: amount,
            senderBalanceEth: web3.utils.fromWei(senderBalance, 'ether'),
            receiverBalanceEth: web3.utils.fromWei(receiverBalance, 'ether')
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Read Contract - Get myNumber
app.get('/api/readContract', async (req, res) => {
    try {
        const myContract = new web3.eth.Contract(abi, contractAddress);
        const myNumber = await myContract.methods.myNumber().call();
        
        res.json({
            success: true,
            contractAddress: contractAddress,
            myNumber: myNumber.toString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Write Contract - Set myNumber
app.post('/api/writeContract', async (req, res) => {
    try {
        const { newNumber } = req.body;

        const myContract = new web3.eth.Contract(abi, contractAddress);
        const account = web3.eth.accounts.privateKeyToAccount(pk);
        
        // Get current value
        const currentValue = await myContract.methods.myNumber().call();
        
        // Set new value
        const receipt = await myContract.methods.setMyNumber(newNumber).send({
            from: account.address,
            gas: 1000000,
            gasPrice: '10000000000',
        });
        
        // Get updated value
        const updatedValue = await myContract.methods.myNumber().call();
        
        res.json({
            success: true,
            transactionHash: receipt.transactionHash,
            previousValue: currentValue.toString(),
            newValue: updatedValue.toString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
