pragma solidity >=0.4.22 <0.8.5;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

  address public minter;

  event MinterChange(address _old, address _new); 

  constructor() public payable ERC20("Wordlecoin", "WDL") {

    _mint(msg.sender, 1000000000000000000000000000);
    minter = msg.sender;

  }

  function passMinterRole (address _game) public returns (bool success) {
  require(msg.sender ==minter, "Error: Only current minter can pass minter role");

  minter = _game;

  emit MinterChange(msg.sender, _game);
  return true;
  }

  function mint(address account, uint256 amount) public {

    require(msg.sender==minter, "Error: You do not have minter role");

		_mint(account, amount);
	}
}