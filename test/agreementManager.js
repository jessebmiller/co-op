const AgreementManager = artifacts.require("./AgreementManager.sol")

contract("AgreementManager", function ([alice, bob, vick, ...accounts]) {

  let manager
  beforeEach(async function() {
    manager = await AgreementManager.new()
  })

  it("

})
