import './App.css';
import web3 from './web3';
import lottery from './lottery';
import {useState, useEffect} from "react";

function App() {
  console.log(web3.version);
  web3.eth.getAccounts().then(console.log);

  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      const manager = await lottery.methods.manager().call(); 
      const players = await lottery.methods.getPlayers().call(); 
      const balance = await web3.eth.getBalance(lottery.options.address);

      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    }
    fetchData();

  });

  const onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts(); 

    setMessage('Waiting on transaction success...');
    await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei(value, 'ether')});
    setMessage('You have been entered!');

  };

  const onClick = async(event) => {
    const accounts = await web3.eth.getAccounts(); 

    setMessage('Waiting on transaction success...');
    await lottery.methods.pickWinner().send({from: accounts[0]});
    setMessage('A winner has been picked!');
  };

  return (
    <div> 
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}. 
        There are currently {players.length} people entered, competing to win {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr/> 
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input onChange = {event => setValue(event.target.value)}/>
          <button>Enter</button>
        </div>
      </form>
      <hr/>
      <hr/>
      <h4>Ready to pick a winner?</h4>
      <button onClick={onClick}>Pick a winner!</button>

      <h1>{message}</h1>
    </div>
  );
}

export default App;
