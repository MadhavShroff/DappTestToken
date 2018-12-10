var DappToken = artifacts.require("./DappToken.sol");

module.exports = function(deployer) {
  deployer.deploy(DappToken, 100000000); // Sends 1 Mil to the constructor of the contract
};
