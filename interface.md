# Contract Interfaces

## CoopBank

The Coop Bank contact is a Zeppelin `StandardToken` with the following methods.

```
coopPrice() public returns (uint256)
mint() public payable returns (uint256)
redeem(uint256 _amount) public returns (uint256)
burn(uint256 _amount) public returns (bool)
```

## AgreementManager

Manages arangements and enforces fees and schedules.

```
struct Agreement {
  uint256 partyAStake,
  uint256 partyBStake,
  address partyA,
  address partyB,
  
}
createAgreement(_partyAStake,
```
