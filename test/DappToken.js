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
        }).then(receipt => {
            return tokenInstance.balanceOf(accounts[1]);
        }).then(balance => {
            assert.equal(balance.toNumber(), 100000, "Balance of account[1] is 100,000");
            return tokenInstance.balanceOf(accounts[0]);
        });
    });
    it("approves tokens for delegated transfers", () => {
        return DappToken.deployed().then(instance => {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(approved => {
            assert.equal(approved, true, "Returns true");
            return tokenInstance.approve(accounts[1], 100);
        }).then(receipt => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', '"Approval" event ust be emitted');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the tokens that are authorized by accounts[0]');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount = 100');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(allowance => {
            assert.equal(allowance.toNumber(), 100, 'Stores the allowance for delegated transfer')
        });
    });
    it("Sends tokens from one user to another as a third party", () => {
        return DappToken.deployed().then(instance => {
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            // assuming sender account has 100 to send
            // try to spend more than possible
            return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
        }).then(receipt => {
            return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
        }).then(receipt => {
            // send something larger than account balance
            return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount});
        }).then(assert.fail).catch(err => {
            assert(err.message.indexOf('revert') >= 0, "Cannot transfer amount larger than balance");
            // send something larger than approved amount
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
        }).then(assert.fail).catch(error => {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer larger than approved amount');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(success => {
            assert(success, true);
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(receipt => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', '"Transfer" event ust be emitted');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the tokens that are authorized by accounts[0]');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are authorized to');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount = 10');
            return tokenInstance.balanceOf(fromAccount);
        }).then(balance => {
            assert.equal(balance.toNumber(), 90, 'deducts the amount from sending account');
            return tokenInstance.balanceOf(toAccount);
        }).then(balance => {
            assert.equal(balance.toNumber(), 10, 'adds the amount from the receiving account');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(allowance => {
            assert.equal(allowance.toNumber(), 0, "deducts the amount from the allowance");
        })
    });
});