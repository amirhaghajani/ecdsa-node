import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

const getBalanceFromServer = async (privateKey) => {
  const publicKey = toHex(secp256k1.getPublicKey(privateKey));
  try {
    const {
      data: { balance },
    } = await server.get(`balance/${publicKey}`);

    return { isSucc: true, balance };
  } catch (ex) {
    alert(ex.response.data.message);
    return { isSucc: false };
  }
};

const transferToRecipient = async (
  currentUserPrivateKey,
  sendAmount,
  recipientPublicKey
) => {
  const publicKey = toHex(secp256k1.getPublicKey(currentUserPrivateKey));

  const message = {
    amount: parseInt(sendAmount),
    recipient: recipientPublicKey,
  };
  const messageHash = keccak256(utf8ToBytes(JSON.stringify(message)));
  const { r, s, recovery } =  secp256k1.sign(messageHash, currentUserPrivateKey);

  const signature = {
    r: r.toString(),  // Convert BigInt to string
    s: s.toString(),  // Convert BigInt to string
    recovery: recovery.toString(), // Convert recovery to string
  };

  try {
    const {
      data: { balance },
    } = await server.post(`send`, {
      amount: parseInt(sendAmount),
      recipient: recipientPublicKey,
      signature,
    });

    return { isSucc: true, balance };
  } catch (ex) {
    alert(ex.response.data.message);
    return { isSucc: false };
  }
};

//users --------------
const users = [
  {
    id: 1,
    name: "Dan",
    privateKey:
      "a84930ad5e08ab1f931c8a96cb33d076e5d9e92b9c791baaa5f91ca67e96976a",
    publicKey:
      "02025890fcb745637195747afde51c8d767eb84bf3176b72c4ce71bb9c441ec2cd",
  },
  {
    id: 2,
    name: "Al",
    privateKey:
      "e6c322129bb09028b35936cf78ffce1030b002362a8c94660a8fd8e1b9a9ec38",
    publicKey:
      "02c61ab7c95b564478533ac340509c94845c10f267c04e6b1d1e10bdb59e266109",
  },
  {
    id: 3,
    name: "Ben",
    privateKey:
      "c136325060febd82135a058f256506a68937868cb0203f99e20743a426a0cf49",
    publicKey:
      "02a24f494ea3ca10b2742d8f721d05e2b6c01eaf27d18743a883fdf4351f64c822",
  },
];

export { getBalanceFromServer, transferToRecipient, users };
