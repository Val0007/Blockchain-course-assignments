const solc = require('solc');
const path = require('path');
const fs = require('fs');
const { Web3 } = require('web3'); 


const fileName = `Contract.sol`;
const web3 = new Web3("HTTP://127.0.0.1:7545")
const privateKey = '0x596e7509080a3d2e23c5eff8012cfdcde6315e9b1ce141f224bffc2448d61ea0';


const contractPath = path.join(__dirname, fileName);
const sourceCode = fs.readFileSync(contractPath, 'utf8');

const input = {
	language: 'Solidity',
	sources: {
		[fileName]: {
			content: sourceCode,
		},
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['*'],
			},
		},
	},
};


const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(compiledCode)
// Get the bytecode from the compiled contract
const bytecode = compiledCode.contracts[fileName]["MyContract"].evm.bytecode.object;
console.log(bytecode)


// Get the ABI from the compiled contract
const abi = compiledCode.contracts[fileName]["MyContract"].abi;
console.log(abi)

// Write the Contract ABI to a new file
const abiPath = path.join(__dirname, 'MyContractAbi.json');
fs.writeFileSync(abiPath, JSON.stringify(abi, null, '\t'));



async function deploy() {


    const myContract = new web3.eth.Contract(abi);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    console.log(account)
    web3.eth.accounts.wallet.add(account);
    const providersAccounts = await web3.eth.getAccounts();
	const defaultAccount = providersAccounts[0];



	const contractDeployer = myContract.deploy({
		data: '0x' + bytecode,
		arguments: [1],
	});

	try {
		const tx = await contractDeployer.send({
			from: account.address,
			gas:6721975,
		});
		console.log('Contract deployed at address: ' + tx.options.address);

		const deployedAddressPath = path.join(__dirname, 'MyContractAddress.txt');
		fs.writeFileSync(deployedAddressPath, tx.options.address);
	} catch (error) {
		console.error(error);
	}
}

deploy()



