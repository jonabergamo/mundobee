import CryptoJS from "crypto-js";

const SECRET_KEY =
  process.env.TOKEN_SECRET_KEY ??
  "j3aK1s/tYqABLltaHH3Bt9qYzWqh/qy6sxj4gWqthRk="; // Troque por uma chave segura

export const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
