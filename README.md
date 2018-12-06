# Basic Eth Token Example
Creates a token and runs a Jasmine test to enure things are in place. 

## To run it : 
1. Install and run a Ganache RPC Server. Set host, port etc in the truffle.js file
2. npm install -g truffle
3. truffle migrate (to migrate the contracts to the RPC (Ropsten testnet also works)
4. truffle test (To test if the token supply is fixed at 1 Mil. This tells you it's deployed to the blockchain properly)

