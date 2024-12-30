import { useState } from "react";
import { transferToRecipient, users } from "./service";

function Transfer({ currentUserPrivateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const [selectedUser, setSelectedUser] = useState({});

  const handleUserComboChange = (event) => {
    const userId = event.target.value;
    const index = users.findIndex((u) => u.id == userId);
    if (index == -1) {
      setSelectedUser({});
    } else {
      setSelectedUser(users[index]);
      setRecipient(users[index].publicKey);
    }
  };

  async function transfer(evt) {
    evt.preventDefault();

    const { isSucc, balance } = await transferToRecipient(
      currentUserPrivateKey,
      parseInt(sendAmount),
      recipient
    );
    if (isSucc) setBalance(balance);
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

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
        Recipient Public Key
        <input
          placeholder="Type an address, for example: 0x2"
          value={selectedUser?.publicKey ?? ""}
          readOnly={true}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
