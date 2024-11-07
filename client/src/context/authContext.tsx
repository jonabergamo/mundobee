"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";
import { AxiosResponse } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { AuthToken, User } from "@/types";
import { ApiRequest } from "@/helper/request.module";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (
    e: any
  ) => Promise<{ success: boolean; message?: string; error?: any }>;
  signOut: () => void;
}

const SECRET_KEY =
  process.env.TOKEN_SECRET_KEY ??
  "j3aK1s/tYqABLltaHH3Bt9qYzWqh/qy6sxj4gWqthRk="; 
export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authTokens, setAuthTokens] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const encryptData = (data: string) => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  };

  const decryptData = (ciphertext: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const signIn = (
    e: any
  ): Promise<{ success: boolean; message?: string; error?: any }> => {
    return new Promise(async (resolve, reject) => {
      const API = new ApiRequest();
      const email = e.target.email.value;
      const password = e.target.password.value;

      try {
        const response: AuthToken = await API.ApiRequest("auth/local/signin", {
          email,
          password,
        });

        console.log(response);

        if (response?.statusCode === 403) {
          reject({ success: false, message: "Email ou senha incorretos." });
        }

        const token: string = response?.access_token;

        if (token) {
          setAuthTokens(token);
          const userData = {
            ...jwtDecode(token),
          } as User;
          setUser(userData);
          const encryptedData = encryptData(JSON.stringify(response));
          Cookies.set("session", encryptedData, {
            secure: true,
            sameSite: "strict",
          });
          resolve({ success: true });
        } else {
          reject({ success: false, message: "Login falhou." });
        }
      } catch (error) {
        reject({ success: false, message: "Erro no servidor.", error: error });
      }
    });
  };

  const signOut = () => {
    setAuthTokens(null);
    setUser(null);
    Cookies.remove("session");
    router.replace("/");
  };

  useEffect(() => {
    const encryptedSession = Cookies.get("session");
    if (encryptedSession) {
      const decryptedSession = decryptData(encryptedSession);
      const parsedSession: AuthToken = JSON.parse(decryptedSession);
      setAuthTokens(parsedSession.access_token);
      const userData = {
        ...jwtDecode(parsedSession.access_token),
        // permission: parsedSession.permission,
      } as User;
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
