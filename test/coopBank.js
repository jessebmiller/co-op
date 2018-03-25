const CoopBank = artifacts.require("./CoopBank.sol")

contract("CoopBank", function([alice, bob, ...accounts]) {

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
    // alice mints 3 ether worth
    amount = web3.toWei(3, "ether")
    await bank.mint({value: amount})
    supplyBefore = await bank.totalSupply.call()
    balanceBefore = web3.eth.getBalance(alice)

    // redeem 2 either worth
    await bank.redeem(web3.toWei(2, "ether"), {from: alice, gasPrice: 0})
    balanceAfter = web3.eth.getBalance(alice)
    supplyAfter = await bank.totalSupply.call()

    // should have 1 ether worth left
    assert.equal(
      await bank.balanceOf(alice),
      web3.toWei(1, "ether"),
      "COOP balance after redeem not 1 ether worth",
    )
    // eth before redeem should be 2 less than eth after redeem
    assert.equal(
      balanceAfter.sub(balanceBefore).div(10**18).toNumber(),
      2,
      "ETH balance before not 2 less than after redeem",
    )
    // total supply should go down by 2 ether worth
    assert.equal(
      supplyBefore.div(10**18).sub(2).toNumber(),
      supplyAfter.div(10**18).toNumber(),
      "supply after redeem did not go down by 2",
    )
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

  it("won't let you burn more than your balance", async function() {
    // mint 1 then try to burn 2
    await bank.mint({value: web3.toWei(1, "ether")})
    try {
      await bank.burn(web3.toWei(2, "ether"))
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
    // mint 1 then try to redeem 2
    await bank.mint({value: web3.toWei(1, "ether")})
    try {
      await bank.redeem(web3.toWei(2, "ether"))
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
