import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { api } from "../services/api";
import { mfaApi } from "../services/mfaApi";
import { setupAuthInterceptors } from "../services/setupInterceptors";
import { UserDetail } from "@/components/model/user";

/* =====================
   TIPOS
===================== */

export type AuthStatus =
| "2fa_required"
| "2fa_setup"
  | "unauthenticated"
  | "2fa_pending"
  | "authenticated";

type AuthContextType = {
  status: AuthStatus;
  token: string | null;
  tempToken: string | null;
  qrCode: string;
  role: string;
  email: string;
  image: string;
  createUserCustomer: (name: string, username: string, password: string) => Promise<void>;
  loginWithPassword: (username: string, password: string) => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  logout: () => void;
  getUser: (email: string) => Promise<UserDetail>;
  updateUser: (id: number, name: string, username: string, image: string) => Promise<void>;
};


const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] =
    useState<AuthStatus>("unauthenticated");
  const [token, setToken] =
    useState<string | null>(null);
  const [tempToken, setTempToken] =
    useState<string | null>(null);
    const [qrCode, setQrCode] =
    useState<string | null>(null);
     const [role, setRole] =
    useState<string | null>(null);
       const [email, setEmail] =
    useState<string | null>(null);
    const [image, setImage] =
    useState<string | null>(null);


  useEffect(() => {
    setupAuthInterceptors(
      () => token,
      () => tempToken
    );
  }, [token, tempToken]);


  async function getUser(email: string) {
     const { data } = await api.get("/authenticated/get-user", {params: {email}});
     setImage(`data:image/jpeg;base64,${data.image}`);
     return data;
    }


  async function createUserCustomer(
    name: string,
    username: string,
    password: string
  ) {
    const { data } = await api.post("/auth/users/create-customer", {
      name,
      username,
      password,
    });
    
  }

  async function updateUser(
    id,
    name,
    username,
    image,
    ) {
    const { data } = await api.put(`/authenticated/update`, {
      id,
      name,
      username,
      image: image ?? null,
    });

    getUser(username);
    return data;
  }


  async function loginWithPassword(
    username: string,
    password: string
  ) {
    const { data } = await api.post("/auth/users/login", {
      username,
      password,
    });

    //seta a role
    setRole(data.role);
    setEmail(username);

    /**
     * Possíveis respostas do backend:
     * - { status: "2fa_required", tempToken }
     * - { status: "2fa_setup", tempToken, qrCode }
     */
    if (
      data.status === "2fa_required" ||
      data.status === "2fa_setup"
    ) {
      setTempToken(data.tempToken);
      setStatus(data.status);
      setQrCode(data.qrCode);
      return;
    }

    /**
     * Login sem 2FA (se existir)
     */
    if (data.token) {
      setToken(data.token);
      setStatus("authenticated");
    }
  }

  /* =====================
     VERIFICAR 2FA
  ===================== */
  async function verify2FA(code: string) {
    if (!tempToken) {
      throw new Error("Token temporário inexistente");
    }

    const { data } = await mfaApi.post(
      "/auth/users/mfa/verify",
      { tempToken ,code }
    );

    /**
     * Backend retorna o access token definitivo
     */
    setToken(data.token);
    setTempToken(null);
    setStatus("authenticated");
  }

  /* =====================
     LOGOUT
  ===================== */
  function logout() {
    setStatus("unauthenticated");
    setToken(null);
    setTempToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        status,
        token,
        tempToken,
        qrCode,
        role,
        email,
        image,
        createUserCustomer,
        loginWithPassword,
        verify2FA,
        logout,
        getUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =====================
   HOOK
===================== */

export function useAuth() {
  return useContext(AuthContext);
}
