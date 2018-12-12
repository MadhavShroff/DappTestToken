pragma solidity >=0.4.2;

contract DappToken {
    // Add a name 
    // Add a Symbol
    string public name = "Flurbo";
    string public symbol = "FLR";
    string public standard = "Flurbo, v1.0";
    
    event Transfer(
        address indexed _from,
        address indexed _to, 
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    uint256 public totalSupply; // publicly visible state variable holds total fixed coin supply
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // function totalSupply() constant returns (uint256 totalSupply) is already defined for us, by ERC 20 

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply; 
        // allocating the initial supply, ie giving the 1 Mil token to someone
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value; 

        emit Transfer(_from, _to, _value);
        return true;
    }
}