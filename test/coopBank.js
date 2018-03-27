const CoopBank = artifacts.require("./CoopBank.sol")

contract("CoopBank initial setup", function([alice, bob, ...accounts]) {

  let bank
  beforeEach(async function() {
    bank = await CoopBank.new()
  })

  it("starts with zero supply", async function() {
    assert.equal(await bank.totalSupply.call(), 0)
  })

  it("starts with COOP price of 1", async function () {
    assert.equal(await bank.coopPrice.call(), 1)
  })

  // test that it can have the agreement manager registered
})

contract("CoopBank mint", function([alice, bob, ...accounts]) {

  let bank
  beforeEach(async function() {
    bank = await CoopBank.new()
  })

  it("mints new COOP without changing price", async function() {
    assert.equal(await bank.balanceOf(alice), 0)
    const amount = 200
    const price = await bank.coopPrice.call()
    const priceBefore = await bank.coopPrice.call()
    priceAfter = await bank.coopPrice.call()
    assert(priceBefore.equals(priceAfter))
    await bank.mint({from: alice, value: amount})
    assert.equal(await bank.balanceOf(alice), amount / price)
  })

  it("lets accounts redeem their COOP", async function() {
    // alice mints 300
    amount = 300
    await bank.mint({value: amount})
    supplyBefore = await bank.totalSupply.call()
    balanceBefore = web3.eth.getBalance(alice)

    // redeem 200
    await bank.redeem(200, {from: alice, gasPrice: 0})
    balanceAfter = web3.eth.getBalance(alice)
    supplyAfter = await bank.totalSupply.call()

    // should have 100 left
    assert.equal(
      await bank.balanceOf(alice),
      100,
      "COOP balance after redeem not 1 ether worth",
    )
    // eth before redeem should be 200 less than after redeem
    assert.equal(
      balanceAfter.sub(balanceBefore).toNumber(),
      200,
      "ETH balance before not 200 less than after redeem",
    )
    // total supply should go down by 200
    assert.equal(
      supplyBefore.sub(200).toNumber(),
      supplyAfter.toNumber(),
      "supply after redeem did not go down by 200",
    )
  })

  // TODO restrict burning to the agreement manager
  it("lets accounts burn their COOP", async function() {
    assert.equal(await bank.balanceOf(alice), 0)
    // mint 400
    await bank.mint({value: 400})
    // burn 100
    await bank.burn(100)
    // alice should have 300 left
    remaining = await bank.balanceOf(alice)
    assert(
      remaining.equals(300),
      "Incorrect amount remaining after burn",
    )
    // the price should have gone up
    ratio = 400 / 300
    assert.equal(await bank.coopPrice.call(), Math.floor(ratio))
  })

  it("won't let you burn more than your balance", async function() {
    // mint 100 then try to burn 200
    await bank.mint({value: 100})
    try {
      await bank.burn(200)
    } catch(e) {
      assert.equal(
        "VM Exception while processing transaction: revert",
        e.message,
      )
      return
    }
    assert.fail("Allowed over burn")
  })

  it("won't let you redeem more than your balance", async function() {
    // mint 100 then try to redeem 200
    await bank.mint({value: 100})
    try {
      await bank.redeem(200)
    } catch(e) {
      assert.equal(
        "VM Exception while processing transaction: revert",
        e.message,
      )
      return
    }
    assert.fail("Allowed overdraw")
  })
})

// TODO: Test agreement manager functionality
// stake, burn, release
