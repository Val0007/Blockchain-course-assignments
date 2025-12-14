const readline = require('readline');
const web3 = require("web3")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  
  rl.question(`Enter the txn hash to analyze `, async (hash) => {
      await fetchRawTrace(hash)
      rl.close();
    });

async function fetchRawTrace(txnHash){
    const target_address = "0x3819c7071f2bc39c83187bf5b5aea79fa3e37c42"
    const result  = await fetch(`https://eth-sepolia.blockscout.com/api/v2/transactions/${txnHash}/raw-trace`)
    const trace = await result.json() //array of (create , call)
    let found = false
    let signatureFound = false

    for(const methodCall of trace){
        if(methodCall["action"]["callType"] == "call"){
            if(methodCall["action"]["to"] == target_address){
                rl.write("\nFound an internal call to the address " + target_address);
                found = true
                signatureFound = verifySignature(methodCall["action"]["input"])
            }
        }
    }

    if(found == false){
        rl.write("\nNo internal call to the address " + target_address + "was found");
    }
    else if(found == true && signatureFound == false){
        console.log(signatureFound)
        rl.write("\nThe function signature was not matched");
        rl.write("\nInternal call was not made to registerData");
    }

}

function verifySignature(inputData){
    function_signature = "registerData(bytes32,bytes32,address,address)"
    function_selector = web3.utils.keccak256Wrapper(function_signature).slice(0,10) //first10 chars are function signature
    
    console.log("\nExpected selector: " + function_selector)
    const input_data = inputData
    actual_selector = input_data.slice(0,10)
    console.log("selector found " + actual_selector)

    if (actual_selector == function_selector){
        console.log("\nThis is a call to registerData(bytes32,bytes32,address,address)")
        console.log("\nSUCCESSFULLY VERIFIED TRANSACTION")
        return true
    }
    return false
}
