// Allows us to use ES6 in our migrations and tests.
require('babel-register')

// I read somewhere that I need this for await/async in my tests
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    }
  },
  mocha: {
    useColors: false
  }
}
