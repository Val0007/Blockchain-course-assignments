const { Web3 } = require('web3'); 
const abi = require('./MyContractAbi.json');


const address  = "0x3cBfC427dD445708bF31F3a4B37389fDe6440bFA"

//THE ONLY PLACE WHERE you'll make a change to switch between different environments
const web3 = new Web3("HTTP://127.0.0.1:7545")

const pk = ""

async function checkBalance(account) {
    try {
      const balance = await web3.eth.getBalance(account);
      console.log('Balance (Wei):', balance);
      console.log('Balance (ETH):', web3.utils.fromWei(balance, 'ether'));
    } catch (error) {
      console.error('Error:', error);
    }
  }

checkBalance(address)
subscribe()


async function sendEth(sender,receiver){
    	// sign and send the transaction


        const privateKey = '';
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        
        console.log('Private key:', privateKey);
        console.log('Derived address:', account);
        //const address  = "0x3cBfC427dD445708bF31F3a4B37389fDe6440bFA"


	const receipt = await web3.eth.sendTransaction({
		from: account.address,
		to: "0x6Fb52050f922C47208864722E05860E38a5209ce",
		// amount in wei
	value: web3.utils.toWei(1, "ether"), 
	});

	// log transaction receipt
	console.log(receipt);


	await checkBalance(account.address);
    await checkBalance("0x6Fb52050f922C47208864722E05860E38a5209ce");
}

sendEth()


async function callSmartContract(){
    contractAddress = "0x2Fa9Aea093d28eA3c7ABe3F4C13B94E4a5f15c92"
    const myContract = new web3.eth.Contract(abi, contractAddress);
    const privateKey = '0xc669eed456388bc57003e5450faf5fe049b9adbfbad657d88349a59a8f501dc8';
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);


    try {
		// Get the current value of my number
        //NO STATE CHANGE - NO GAS FEE
		const myNumber = await myContract.methods.myNumber().call();
		console.log('myNumber value: ' + myNumber);




        // Increment my number - STATE CHANGE
		const receipt = await myContract.methods.setMyNumber(BigInt(myNumber) + 1n).send({
			from: account.address,
			gas: 1000000,
			gasPrice: '10000000000',
		});
		console.log('Transaction Hash: ' + receipt.transactionHash);

		// Get the updated value of my number
		const myNumberUpdated = await myContract.methods.myNumber().call();
		console.log('myNumber updated value: ' + myNumberUpdated);
    }
 catch (error) {
    console.error(error);
}

}

callSmartContract()



