const CoopBank = artifacts.require("./CoopBank.sol")

contract("CoopBank initial setup", function([alice, bob, ...accounts]) {

  let bank
  beforeEach(async function() {
    bank = await CoopBank.new()
  })

  it("... zero supply", async function() {
    assert.equal(await bank.totalSupply.call(), 0)
  })

  it("... COOP price of 1", async function () {
    assert.equal(await bank.coopPrice.call(), 1)
  })
})

contract("CoopBank mint", function([alice, bob, ...accounts]) {

  let bank
  beforeEach(async function() {
    bank = await CoopBank.new()
  })

  it("should mint without changing price", async function() {
    const priceBefore = await bank.coopPrice.call()
    await bank.mint({from: alice, value: web3.toWei(1, "ether")})
    priceAfter = await bank.coopPrice.call()
    assert(priceBefore.equals(priceAfter))
  })

  it("should give the minter the new COOP", async function() {
    assert.equal(await bank.balanceOf(alice), 0)
    const amount = web3.toWei(2, "ether")
    const price = await bank.coopPrice.call()
    await bank.mint({from: alice, value: amount})
    assert.equal(await bank.balanceOf(alice), amount / price)
  })
})
