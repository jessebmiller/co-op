const CoopBank = artifacts.require("./CoopBank.sol")
const CoopAgreementManager = artifacts.require("./CoopAgreements.sol")

contract("CoopAgreements...", function ([alice, bob, ...accounts]) {

  let bank
  let am
  beforeEach(async function() {
    bank = await CoopBank.new()
    am = await CoopAgreementManager.new(bank.address)
    bank.setAgreementManager(am.address)
    bank.mint({from: alice, amount: 1000})
    bank.mint({from: bob, amount: 700})
  })

  // agreement setup
  it("Can be proposed, accepted and completed", async function() {
    const agreementText = "All who enter this agreement shall be satisfied."
    const agreementHash = web3.sha3(agreementText)
    const aliceStake = 100
    const bobStake = 70
    const completionTimeLimit = 100 // time limit of 100 blocks
    const nonce = Math.random()

    // TODO write an agreement signing library function
    const proposal = {
      hash: agreementHash,
      firstPartyStake: aliceStake,
      secondPartyStake: bobStake,
      completionTimeLimit: completionTimeLimit,
      // nonce lets the proposal be uniquely identifiable by the first party
      // signature
      nonce: nonce
    }
    const aliceSignature = web3.eth.sign(alice, JSON.stringify(proposal))
    am.proposeAgreement(
      agreementHash,
      aliceStake,
      bobStake,
      completionTimeLimit,
      aliceSignature,
    )
    const bobSignature = web3.eth.sign(bob, JSON.stringify(proposal))
    am.acceptProposal(proposal, bobStake, bobSignature)

    // confirm stakes are correct
    const stakes = await bank.getStakes(proposal)
    assert.equal(stakes, [aliceStake, bobStake])

    // confirm agreement is correct
    const agreement = await am.getAgreement(proposal)
    assert.equal(agreement.hash, agreementHash)
    assert.equal(agreement.firstPartyStake, aliceStake)
    assert.equal(agreement.secondPartyStake, bobStake)
    assert.equal(agreement.completionTimeLimit, completionTimeLimit)
    assert.equal(agreement.firstPartySignature, aliceSignature)
    assert.equal(agreement.secondPartySignature, bobSignature)
    assert.equal(agreement.firstPartyComplete, false)
    assert.equal(agreement.secondPartyComplete, false)

    // satisfaction shouldn't be able to be set until a party calls complete
    assert.equal(agreement.firstPartySatisfied, 0)
    assert.equal(agreement.secondPartySatisfied, 0)
  })

  it("Logs the agreement id and participants", async function() {
    assert(false)
  })

  it("Requires proposer has the balance to stake", async function() {
    bobBalance = await bank.balanceOf(bob)
    try {
      // bob proposes an agreement with a stake more than they can afford
    } catch(e) {
      assert.equal(
        "VM Exception while processing transaction: revert",
        e.message,
      )
      return
    }
    assert.fail("Allowed over stake")
  })

  it("Requires acceptor has the balance to stake", async function() {
    bobBalance = await bank.balanceOf(bob)
    try {
      // alice proposes an agreement that bob can't afford, bob tries to accept
    } catch(e) {
      assert.equal(
        "VM Exception while processing transaction: revert",
        e.message,
      )
      return
    }
    assert.fail("Allowed over stake")
  })

  it("Requires proposers valid signature", async function() {
    assert(false)
  })

  it("Requires acceptors valid signature", async function() {
    assert(false)
  })

  // completion
  // test satisfaction matrix outcomes
})
