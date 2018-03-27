pragma solidity ^0.4.11;


import 'zeppelin/contracts/ownership/Ownable.sol';

contract AgreementManager is Ownable {

  address public bank;

  function AgreementManager(address _bank) public onlyOwner {
    bank = _bank;
  }
}
