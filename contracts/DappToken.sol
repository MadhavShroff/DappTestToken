pragma solidity >=0.4.2;

contract DappToken {
    // Needs a constructor
    // Set number of tokens
    // Read number of tokens

    uint256 public totalSupply; // publicly visible state variable holds total fixed coin supply

    // function totalSupply() constant returns (uint256 totalSupply) is already defined for us, by ERC 20 

    constructor() public {
        totalSupply = 100000000; // Set to 1 Mil tokens
    }
}