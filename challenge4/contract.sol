pragma solidity ^0.8.0;

interface Challengecontract {
    function registerData(
        bytes32 tx_challenge01,
        bytes32 tx_challenge02,
        address contract_challenge03,
        address contract_challenge04
    ) external;
}


contract MyChallenge{
    constructor(){
        Challengecontract C =  Challengecontract(0x3819C7071f2bc39C83187Bf5B5aeA79Fa3e37C42);
        C.registerData(0x67cd0cd670acc33532f056d89f083135cbb614f8d8ee9ae8bbed529179c05475, 0x317373a8bbcc98d6ab3f8242d37a548a655c91417697c3ac7540aeae8e27ffef, 0x356A49f8caDEcAd20e98302BA2400A9ba1a742bc, address(this));
    }
}