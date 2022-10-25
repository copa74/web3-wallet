import { useState, useEffect } from "react";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Web3 from "web3";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [provider, setProvider] = useState(window.ethereum);
  const [chainId, setChainId] = useState(null);
  const [web3, setWeb3] = useState(null);

  const NETWORKS = {
    1: "Ethereum Main Network",
    3: "Ropsten Test Network",
    4: "Rinkeby Test Network",
    5: "Goerli Test Network",
    42: "Kovan Test Network",
  };

  const onLogin = async (provider) => {
    const web3 = new Web3(provider); 
    const accounts = await web3.eth.getAccounts();
    const chainId = await web3.eth.getChainId();
    if (accounts.length === 0) { // 로그인 실패시
      onLogout();
      console.log("Please connect to MetaMask!");
    } else if (accounts[0] !== currentAccount) { // 로그인 성공
      setProvider(provider); // provider 셋팅
      setWeb3(web3);         // web3 셋팅
      setChainId(chainId);  // 현재 지갑 네트워크  셋팅
      setCurrentAccount(accounts[0]); // 지갑 주소 셋팅
      setIsConnected(true);  // 연결된상태를 프론트에 알리는 state 셋팅
    }
  };

  useEffect(() => {
      const handleAccountsChanged = async (accounts) => {
        const web3Accounts = await web3.eth.getAccounts(); //지갑
        if (accounts.length === 0) { // 지갑이 없으면 ? 
          console.log("Please connect to MetaMask!");
        } else if (accounts[0] !== currentAccount) {
          setCurrentAccount(accounts[0]); // 지갑 연결
          setIsConnected(true); // 지갑연결 확인 
        }
      }

      const handleChainChanged = async (chainId) => {
        const web3ChainId = await web3.eth.getChainId(); 
        setChainId(web3ChainId);  // 네트워크  state에 저장 
      };

      if (isConnected) {
      provider.on("accountsChanged", handleAccountsChanged);  // 계정 전환 감지
      provider.on("chainChanged", handleChainChanged); // 네트워크 전환 감지
    }

    // ethereum.on('disconnect', handler: (error: ProviderRpcError) => void);

    return () => {
      if (isConnected) {
        provider.removeListener("accountsChanged", handleAccountsChanged);
        provider.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [isConnected]);


  const getCurrentNetwork = (chainId) => {
    return NETWORKS[chainId];
  };

  const onLogout = () => {
    setIsConnected(false);
    setCurrentAccount(null);
    setWeb3(null);
    setChainId(null);
    setProvider(null);
  }

  return (
    <div>
      <button style={{ position: "absolute" }}  onClick={onLogout} >로그아웃</button>
      <header className="main-header">
        <h1>React &amp; Web3</h1>
        <nav className="nav">
          <ul>
            <li>
              <a href="/">{currentAccount}</a>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        {!isConnected && <Login onLogin={onLogin} onLogout={onLogout} />}
        {isConnected && (
          <Home
            currentAccount={currentAccount}
            currentNetwork={getCurrentNetwork(chainId)}
          />
        )} 
      </main>
    </div>
  );
}

export default App;
