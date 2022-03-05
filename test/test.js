const Token = artifacts.require('./Token')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Token', ([deployer, user]) => {
  let token
  let accounts
  let totalsupply

  beforeEach(async () => {
    token = await Token.new()
    accounts = web3.eth.getAccounts()
  })

  describe('testing token contract...', () => {
    describe('success', () => {
      it('checking token name', async () => {
        expect(await token.name()).to.be.eq('Wordlecoin')
      })

      it('checking token symbol', async () => {
        expect(await token.symbol()).to.be.eq('WDL')
      })

      it('checking token initial total supply', async () => {
        totalsupply = await token.totalSupply()
        expect(totalsupply.toString()).to.eq("1000000000000000000000000000")
      })

      it('Deployer should have Token minter role', async () => {
        expect(await token.minter()).to.eq(accounts[0])
      })

    })

    describe('failure', () => {
      it('passing minter role should be rejected', async () => {
        await token.passMinterRole(user, {from: user}).should.be.rejectedWith(EVM_REVERT)
      })
    })
  })
