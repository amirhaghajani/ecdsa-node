const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex,utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "02025890fcb745637195747afde51c8d767eb84bf3176b72c4ce71bb9c441ec2cd": 100,
  "02c61ab7c95b564478533ac340509c94845c10f267c04e6b1d1e10bdb59e266109": 50,
  "02a24f494ea3ca10b2742d8f721d05e2b6c01eaf27d18743a883fdf4351f64c822": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, signature } = req.body;

  const message = { amount, recipient };
  const messageHash = keccak256(utf8ToBytes(JSON.stringify(message)));


  const recovery = parseInt(signature.recovery); // Recovery ID (0 or 1)

  // Concatenate r, s, and recovery to create the compact signature
  const compactSignature = signatureToUint8Array(signature);

  let signatureObj = secp256k1.Signature.fromCompact(compactSignature);
  signatureObj = signatureObj.addRecoveryBit(recovery);
  
  const publicKey = signatureObj.recoverPublicKey(messageHash).toRawBytes();;

  const sender = toHex(publicKey);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function signatureToUint8Array(signature) {
  const r = BigInt(signature.r);
  const s = BigInt(signature.s);

  // Convert to hexadecimal string
  const rHex = r.toString(16).padStart(64, '0');
  const sHex = s.toString(16).padStart(64, '0');

  // Directly convert r and s from hex string to Uint8Array
  const rBytes = hexStringToUint8Array(rHex);
  const sBytes = hexStringToUint8Array(sHex);

  return new Uint8Array([...rBytes, ...sBytes]);
}

function hexStringToUint8Array(hexString) {
  console.log(hexString, hexString.length);

  // Check if the hex string has a valid even length
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }

  // Use Buffer.from to create a buffer from the hex string
  const buffer = Buffer.from(hexString, 'hex');

  // Convert the buffer to a Uint8Array
  return new Uint8Array(buffer);
}
