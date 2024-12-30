import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [currentUserPrivateKey, setCurrentUserPrivateKey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        setCurrentUserPrivateKey={setCurrentUserPrivateKey}
      />
      <Transfer setBalance={setBalance} currentUserPrivateKey={currentUserPrivateKey} />
    </div>
  );
}

export default App;
