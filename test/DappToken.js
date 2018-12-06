var DappToken = artifacts.require("./DappToken.sol");


contract(DappToken, function(accounts) {
    it("Sets the total supply upon deployment", () => {
        return DappToken.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then((total) => {
            console.log(total);
            assert.equal(total.toNumber(), 100000000, 'sets total supply to 1 Mil');
        });
    });
});