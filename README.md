# co-op
Repeated voluntary prisoner's dilemma for long term incentivised cooperation.

# Theory
The strategy for unlimited repeated rounds of the prisoners dilema is to
cooperate. A system allowing parties to bind themselves to an agreement through
repeated rounds could create strong long term incentives for cooperation between
strangers.

# Protocol

* Two parties agree to some proposal
* They agree to some parameters of the agreement
  * Each of their stake amounts
  * The completion process time limit
* Either of them creates a new co-op agreement with the parameters agreed to and
  a hash of the agreement.
* Each of them signs the proposal and registers that signature with the co-op
  agreement.
* Each of them stake their amount in COOP.
* The agreement is not finalized until both parties sign the agreement and stake
  their agreed to amount.
* Once the agreement is finalized either party may begin the completion process
* Once the completion process begins, each party has until the completion
  process time limit to report whether the agreement has been satisfied or not
* If both parties agree that the agreement has been satisfied, they may each
  withdraw their stakes minus a small fee which is burned.
* If neither of the parties are satisfied they each may withdraw their stakes
  minus a moderate fee which is burned
* If one party is satisfied but the other is not, the satisfied party is charged
  a large fee while the unsatisfied party is not charged any fee

# Tokens and fees

COOP is backed by a pool of ETH held by the minting contract. COOP may at any
time be redeemed for a proportional amount of the ETH pool and may be minted by
depositing ETH into the pool in exchange for an amount of COOP that maintains
the proportion of total deposited ETH to total supply of COOP.

COOP is burned as fees are charged during the completion of an agreement.
Fees for completion in contracts where both parties are satisfied are burned
without burning their backing ETH, increasing the amount of ETH backing the
remaining COOP. However, fees charged when anyone is not satisfied are burned
along with the ETH backing them in order to avoide any incentive for speculators
to undermine satisfactory completion of agreements.

# Reputation

A history of successful agreements will lend a good reputation to an address.
