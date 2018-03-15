let CoopBank = artifacts.require("./CoopBank.sol")

module.exports = function(deployer) {
  deployer.deploy(CoopBank);
};
