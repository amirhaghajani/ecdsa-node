import { useState } from "react";
import server from "./server";
import { getBalanceFromServer, users } from "./service";

function Wallet({ setCurrentUserPrivateKey, balance, setBalance }) {



  const [selectedUser, setSelectedUser] = useState({});

  const handleUserComboChange = (event) => {
    const userId = event.target.value;
    const index = users.findIndex((u) => u.id == userId);
    if (index == -1) {
      setSelectedUser({});
    } else {
      setSelectedUser(users[index]);
      getBalanceOfUser(users[index].privateKey);
      setCurrentUserPrivateKey(users[index].privateKey)
    }
  };


  async function getBalanceOfUser(privateKey) {
    const { isSucc, balance } = await getBalanceFromServer(privateKey);
    if (isSucc) {
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }


  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Select User
        <select onChange={handleUserComboChange}>
          <option value="-1">Select ...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Private Key
        <input
          placeholder="Type an address, for example: 0x1"
          value={selectedUser?.privateKey??''}
          readOnly={true}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
