const CoopBank = artifacts.require("./CoopBank.sol")
const CoopAgreementManager = artifacts.require("./AgreementManager.sol")

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

  async function proposeAgreement(firstParty,
                                  secondParty,
                                  firstStake,
                                  secondStake,
                                  completionTimeLimit,
                                 ) {
    const agreementText = "All who enter this agreement shall be satisfied."
    const agreementHash = web3.sha3(agreementText)
    const nonce = Math.random()

    // TODO write an agreement signing library function
    const proposal = {
      hash: agreementHash,
      firstParty: firstParty,
      secondParty: secondParty,
      firstPartyStake: firstStake,
      secondPartyStake: secondStake,
      completionTimeLimit: completionTimeLimit,
      // nonce lets the proposal be uniquely identifiable by the first party
      // signature
      nonce: nonce
    }
    const firstPartySignature = web3.eth.sign(
      firstParty,
      JSON.stringify(proposal),
    )
    await am.proposeAgreement(
      agreementHash,
      secondParty,
      firstStake,
      secondStake,
      completionTimeLimit,
      firstPartySignature,
      {from: firstParty},
    )
    return proposal
  }
  // agreement setup
  it("Can be proposed, accepted and completed", async function() {

    const aliceStake = 100
    const bobStake = 70
    const proposal = proposeAgreement(alice, bob, aliceStake, bobStake, 5555)
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

  it("Requires proposer has the balance to stake", async function() {
    bobBalance = await bank.balanceOf(bob)
    aliceBalance = await bank.balanceOf(alice)
    try {
      // bob proposes an agreement with a stake more than they can afford
      proposeAgreement(bob, alice, bobBalance + 1, aliceBalance, 5555)
    } catch(e) {
      assert.equal(
        "VM Exception while processing transaction: revert",
        e.message,
      )
      return
    }
    assert.fail("Allowed over stake")
  })

  it("Requires balance to cover all proposals", async function() {
    const bobBalance = await bank.balanceOf(bob)
    const aliceBalance = await bank.balanceOf(alice)
    const pa = await proposeAgreement(
      bob,
      alice,
      bobBalance - 1,
      aliceBalance,
      5555,
    )
    try {
      pb = await proposeAgreement(bob, accounts[0], 2, 2, 5555)
    } catch(e) {
      assert.equal(
        "VM Exception while processing transaction: revert",
        e.message,
      )
      return
    }
    assert.fail("allowed over propose")
  })

  it("Requires acceptor has the balance to stake", async function() {
    const aliceBalance = await bank.balanceOf(alice)
    const bobBalance = await bank.balanceOf(bob)
    const proposal = await proposeAgreement(
      alice,
      bob,
      aliceBalance,
      bobBalance + 1,
      5555,
    )
    try {
      const bobSignature = web3.eth.sign(bob, JSON.stringify(proposal))
      am.acceptProposal(proposal, bobBalance + 1, bobSignature)
    } catch(e) {
      assert.equal(
        "VM Exception while processing transaction: revert",
        e.message,
      )
      return
    }
    assert.fail("Allowed accept over stake")
  })

  it("Requires proposers valid signature", async function() {
    const proposal = {
      hash: web3.sha3("Let's not sign it correctly."),
      firstParty: alice,
      secondParty: bob,
      firstPartyStake: await bank.balanceOf(alice) / 2,
      secondPartyStake: await bank.balanceOf(bob) / 2,
      completionTimeLimit: 5555,
      nonce: Math.random()
    }
    const invalidAliceSignature = web3.eth.sign(bob, JSON.stringify(proposal))
    try {
      await am.proposeAgreement(
        proposal.hash,
        proposal.secondParty,
        proposal.firstPartyStake,
        proposal.secondPartyStake,
        proposal.completionTimeLimit,
        proposal.nonce,
        invalidAliceSignature,
        {from: alice},
      )
    } catch(e) {
      assert.equal(
        "VM Exception while processing transaction: revert",
        e.message,
      )
      return
    }
    assert.fail("accepted invalid signature")

  })

  it("Requires acceptors valid signature", async function() {
    const proposal = {
      hash: web3.sha3("Let's not sign it correctly."),
      firstParty: alice,
      secondParty: bob,
      firstPartyStake: await bank.balanceOf(alice) / 2,
      secondPartyStake: await bank.balanceOf(bob) / 2,
      completionTimeLimit: 5555,
      nonce: Math.random()
    }
    const AliceSignature = web3.eth.sign(alice, JSON.stringify(proposal))
    await am.proposeAgreement(
      proposal.hash,
      proposal.secondParty,
      proposal.firstPartyStake,
      proposal.secondPartyStake,
      proposal.completionTimeLimit,
      proposal.nonce,
      AliceSignature,
      {from: alice},
    )
    const invalidBobSignature = web3.eth.sign(alice, JSON.stringify(proposal))
    try {
      am.acceptProposal(proposal, invalidBobSignature, JSON.stringify(proposal))
    } catch(e) {
      assert.equal(
        "VM Exception while processing transaction: revert",
        e.message,
      )
      return
    }
    assert.fail("accepted invalid signature")
  })

  // discoverability: how can someone watch for proposals in which they are the
  // second party and how can a first party inform a second party where to find
  // the proposal
 
  // completion
  // test satisfaction matrix outcomes
})
