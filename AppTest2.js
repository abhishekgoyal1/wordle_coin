import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {

      if(typeof window.ethereum !== 'undefined') {

        const web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        const netId = await web3.eth.net.getId();
        console.log(netId);
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        if(typeof accounts[0]!=='undefined') {
            const balance = await web3.eth.getBalance(accounts[0]);
            console.log(balance);
            this.setState({account: accounts[0], balance: balance, web3: web3});


        try {
            const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address);
            const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address);
            const dbankaddress = dBank.networks[netId].address;
            const tokenaddress =Token.networks[netId].address;
            this.setState({token: token, dbank: dbank, dBankAddress:dbankaddress});
            //console.log(dbankaddress);
            console.log(tokenaddress);
        } catch(e) {
          console.log('Error', e);
          window.alert('Contracts not deployed to current network');
        }
        

        }
        else {window.alert ('Please login with your Metamask account')}
      }
      else {window.alert ('Please install Metamask')}

      //assign to values to variables: web3, netId, accounts

      //check if account is detected, then load balance&setStates, elsepush alert

      //in try block load contracts

    //if MetaMask not exists push alert
  }

  async deposit(amount) {
    console.log(amount)
    if(this.state.dbank!=='undefined') {
      try{
          await this.state.dbank.methods.deposit().send({value: amount.toString(), from: this.state.account})

      } catch(e) {
        console.log('Error, deposit:', e)
      }
    }
    //check if this.state.dbank is ok
      //in try block call dBank deposit();
  }

  async withdraw(e) {
    e.preventDefault()

    try{
      await this.state.dbank.methods.withdraw().send({from:this.state.account})
    } catch(e) {

        console.log('Error, withdraw:', e)

    }

  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <b> SGBank: Saving Gets Better</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to SGBank</h1>
          <h2>Start your DeFi journey with us</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="deposit" title="Deposit ETH">
                <div>
                <br></br>
                How much do you want to Deposit?
                <br></br>
                Minimum deposit amount is 0.01 ETH. 
                <br></br>
                Only 1 deposit possible currently.
                <br></br>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  let amount =this.depositAmount.value
                  amount = amount*10**18
                  this.deposit(amount)
                }}>
                  <div className = 'form-group mr-sm-2'>
                  <br></br>
                    <input
                      id = 'depositAmount'
                      step="0.01"
                      type='number'
                      className="form-control form-control-md"
                      placeholder='amount..'
                      ref={(input)=> {this.depositAmount = input }}

                    />
                  </div>
                  <button type='submit' className='btn btn-primary'>DEPOSIT</button>
                </form>

                </div>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                <br></br>
                Do you want to withdraw and take interest?
                <br></br>
                <div>
                 <button type='submit' className='btn btn-primary' onClick={(e) => this.withdraw(e)}>WITHDRAW</button>
                </div>
                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;