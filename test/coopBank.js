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

  it("mints new COOP without changing price", async function() {
    assert.equal(await bank.balanceOf(alice), 0)
    const amount = web3.toWei(2, "ether")
    const price = await bank.coopPrice.call()
    const priceBefore = await bank.coopPrice.call()
    priceAfter = await bank.coopPrice.call()
    assert(priceBefore.equals(priceAfter))
    await bank.mint({from: alice, value: amount})
    assert.equal(await bank.balanceOf(alice), amount / price)
  })

  it("lets accounts redeem their COOP", async function() {
    assert.equal(await bank.balanceOf(alice), 0)
    amount = web3.toWei(3, "ether")
    await bank.mint({value: amount})
    assert.equal(await bank.balanceOf(alice), amount)
    balanceBefore = web3.eth.getBalance(alice)
    await bank.redeem(web3.toWei(2, "ether"))
    balanceAfter = web3.eth.getBalance(alice)
    assert.equal(await bank.balanceOf(alice), web3.toWei(1, "ether"))
    assert.equal(balanceBefore, balanceAfter + 2)
  })

  it("lets accounts burn their COOP", async function() {
    assert.equal(await bank.balanceOf(alice), 0)
    // mint 4
    await bank.mint({value: web3.toWei(4, "ether")})
    // burn 1
    await bank.burn(web3.toWei(1, "ether"))
    // alice should have 3 left
    remaining = await bank.balanceOf(alice)
    assert(
      remaining.equals(web3.toWei(3, "ether")),
      "Incorrect amount remaining after burn",
    )
    // the price should have gone up
    ratio = web3.toWei(4, "ether") / web3.toWei(3, "ether")
    assert.equal(await bank.coopPrice.call(), Math.floor(ratio))
  })

  // can't burn more than you own
  // can't redeem more than you own
})
