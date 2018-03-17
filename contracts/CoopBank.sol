pragma solidity ^0.4.11;


import 'zeppelin/contracts/token/StandardToken.sol';
import 'zeppelin/contracts/math/SafeMath.sol';


contract CoopBank is StandardToken {
  using SafeMath for uint256;

  //  function CoopBank() public { }

  /*
   * The COOP price in ETH (wei)
   */
  function coopPrice() public returns (uint256) {
    if (totalSupply == 0) {
      // price of COOP is 1:1 with ETH at the start
      return 1;
    }
    return this.balance.div(totalSupply);
  }

  /*
   * Mint new COOP and return how much was minted
   */
  function mint() public payable returns (uint256) {
    // increase the total supply and the senders balance by an amount of
    // COOP that maintains the COOP to ETH proportions.
    uint256 price = coopPrice();
    require(msg.value >= price);
    uint256 amount = msg.value.div(price);
    totalSupply = totalSupply.add(amount);
    balances[msg.sender] = balances[msg.sender].add(amount);
    return amount;
  }

  /*
   * Redeem COOP for the ETH backing it
   */
  function redeem(uint256 _amount) public returns (uint256) {
    require(balances[msg.sender] >= _amount);
    uint256 value = _amount * coopPrice();
    balances[msg.sender] = balances[msg.sender].sub(_amount);
    totalSupply = totalSupply.sub(_amount);
    msg.sender.transfer(value);
    return value;
  }

  /*
   * burn removes COOP from the supply and the message sender's balance.
   */
  function burn(uint256 _amount) public returns (bool) {
    require(balances[msg.sender] >= _amount);
    balances[msg.sender] = balances[msg.sender].sub(_amount);
    return true;
  }
}
