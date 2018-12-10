var DappToken = artifacts.require("./DappToken.sol");

contract(DappToken, function(accounts) {
    var tokenInstance;

    it("initializes the contract with the values", () => {
        return DappToken.deployed().then( (instance) => {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then((name) => {
            assert.equal(name, "Flurbo", "Has the correct name");
            return tokenInstance.symbol();
        }).then((sym) => {
            assert.equal(sym, "FLR", "Has the correct Symbol");
            return tokenInstance.standard();
        }).then( std => {
            assert.equal(std, "Flurbo, v1.0", "Has the correct standard");
        })
    });
    it("Allocates the total supply upon deployment", () => {
        return DappToken.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then((total) => {
            console.log(total);
            assert.equal(total.toNumber(), 100000000, 'sets total supply to 100 Mil');
            return tokenInstance.balanceOf(accounts[0]); 
        }).then((accountbalance) => {
            assert.equal(accountbalance.toNumber(), 100000000, "Allocates the initial supply to admin account")
        });
    });
    it("transfers ownership of tokens", () => {
        return DappToken.deployed().then( (instance) =>  {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 10124710298120398121121242);
        }).then(assert.fail).catch((err) => {
            assert(err.message.indexOf('revert') >= 0, 'error message must contain the word revert');
            return tokenInstance.transfer(accounts[1], 100000, {from: accounts[0]});
        }).then(reciept => {
            return tokenInstance.balanceOf(accounts[1]);
        }).then(balance => {
            assert.equal(balance.toNumber(), 100000, "Balance of account[1] is 100,000");
            return tokenInstance.balanceOf(accounts[0]);
        });
    });
});