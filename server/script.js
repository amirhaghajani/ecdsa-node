const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

for(var i=0;i<3;i++){
  var privateKey = secp256k1.utils.randomPrivateKey();
  var publicKey = secp256k1.getPublicKey(privateKey);
  
  console.log("Private key: ", toHex(privateKey));
  console.log("Public key: ", toHex(publicKey));
  console.log("------------------------------------");
}

