import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/authContext";
import { AuthToken } from "@/types";

const SECRET_KEY =
  process.env.TOKEN_SECRET_KEY ??
  "j3aK1s/tYqABLltaHH3Bt9qYzWqh/qy6sxj4gWqthRk="; // Troque por uma chave segura

const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

const decryptData = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const useAxios = (): AxiosInstance => {
  const { signOut } = useAuth();

  const defaultOptions = {
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Create instance
  const instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(async function (config) {
    const encryptedSession = Cookies.get("session");
    if (encryptedSession) {
      const decryptedSession = decryptData(encryptedSession);
      const parsedSession: AuthToken = JSON.parse(decryptedSession);
      const decodedToken = jwtDecode(parsedSession.access_token);

      if (new Date() > new Date(Number(decodedToken.exp) * 1000)) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${parsedSession.refresh_token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const newAccessToken = response.data.access_token;
          config.headers.Authorization = `Bearer ${newAccessToken}`;

          // Atualizar a sessão criptografada no cookie
          const updatedSession: AuthToken = {
            access_token: newAccessToken,
            refresh_token: parsedSession.refresh_token,
          };
          const encryptedUpdatedSession = encryptData(
            JSON.stringify(updatedSession)
          );
          Cookies.set("session", encryptedUpdatedSession);
        } catch (error) {
          console.error("Failed to refresh token:", error);
          signOut();
        }
      } else {
        config.headers.Authorization = `Bearer ${parsedSession.access_token}`;
      }
    }
    return config;
  });

  return instance;
};
