import { useState, useEffect } from "react";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";

const Login = (props) => {
  const [isConnecting, setIsConnecting] = useState(false); // 연결중 표시 확인
  const [provider, setProvider] = useState(window.ethereum); // window.ethereum 있는지 감시자 
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false); // 메타 마스크 설치 확인

  useEffect(() => {
    setProvider(detectProvider());
    // 접속 했을때 감시자 셋팅 
  }, []);

  useEffect(() => {
    if (provider) {
      if (provider !== window.ethereum) {
        console.error(
          "메타마스크를 설치해!!"
        );
      }
      setIsMetaMaskInstalled(true);
    }
    // 메타마스크를 설치 했는지 안했는지 확인 해주는 문구 
  }, [provider]);

  const detectProvider = () => {
    //provider 는 감지 
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else {
      console.alert("No Ethereum browser detected! Check out MetaMask");
      // 메타마스크가 감지되지 않음 
    }
    return provider;
  };

  const onLoginHandler = async () => {
    const provider = detectProvider();
    if(provider) {
      if (provider !== window.ethereum) {
        console.error("Not window.ethereum provider. Do you have multiple wallet installed ? ")
      }
    }
    setIsConnecting(true);
    await provider.request({
      method:"eth_requestAccounts"
    })
    props.onLogin(provider);
    // props.onLogin();
  };

  return (
    <Card className={classes.login}>
    {isMetaMaskInstalled && (
        <button
          onClick={onLoginHandler}
          className={classes.button}
          type="button"
        >
          {!isConnecting && "Connect"}
          {isConnecting && "Loading..."}
        </button>
       )} 
       {!isMetaMaskInstalled && (
        <p>
          <a href="/">Install MetaMask</a>
        </p>
      )}  
    </Card>
  );
};

export default Login;
