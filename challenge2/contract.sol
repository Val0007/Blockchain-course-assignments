pragma solidity ^0.8.0;

contract ContractCaller {
    // Target contract address
    address public constant TARGET_CONTRACT = 0xe621aBEa69C75dA07C3850eeA3965DE0599d4B3D;
    
    // Function selector (first 10 characters of keccak256 hash of function signature)
    bytes4 public constant FUNCTION_SELECTOR = 0x42424243;
    
    

    function callTargetFunction() external returns (bytes memory returnData) {
        // Encode the function call
        bytes memory data = abi.encodeWithSelector(FUNCTION_SELECTOR);
        
        // Call the target contract (reverts on failure)
        (bool success, bytes memory result) = TARGET_CONTRACT.call(data);
        
        require(success, "External call failed");
                
        return result;
    }
}