import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiRequest } from "../lib/api";
import { readJson, removeKey, writeJson } from "../lib/storage";

type Customer = {
  id: string;
  name: string;
  email: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

type AuthState = {
  token: string | null;
  customer: Customer | null;
};

type AuthContextValue = AuthState & {
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  }) => Promise<void>;
  logout: () => void;
};

const STORAGE_KEY = "pizzaria.auth";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider(props: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const raw = readJson<{ token?: unknown; customer?: unknown }>(STORAGE_KEY);
    const token =
      raw && typeof raw === "object" && typeof raw.token === "string"
        ? raw.token
        : null;
    const customerRaw =
      raw && typeof raw === "object"
        ? (raw as { customer?: unknown }).customer
        : undefined;
    if (!customerRaw || typeof customerRaw !== "object") {
      return { token, customer: null };
    }
    const c = customerRaw as Partial<Customer>;
    if (typeof c.id !== "string") return { token, customer: null };
    if (typeof c.name !== "string") return { token, customer: null };
    if (typeof c.email !== "string") return { token, customer: null };

    return {
      token,
      customer: {
        id: c.id,
        name: c.name,
        email: c.email,
        cep: typeof c.cep === "string" ? c.cep : "",
        street: typeof c.street === "string" ? c.street : "",
        number: typeof c.number === "string" ? c.number : "",
        complement: typeof c.complement === "string" ? c.complement : "",
        neighborhood: typeof c.neighborhood === "string" ? c.neighborhood : "",
        city: typeof c.city === "string" ? c.city : "",
        state: typeof c.state === "string" ? c.state : "",
      },
    };
  });

  const persist = useCallback((next: AuthState) => {
    setState(next);
    writeJson(STORAGE_KEY, next);
  }, []);

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      const res = await apiRequest<{ customer: Customer; accessToken: string }>(
        {
          path: "/api/auth/login",
          method: "POST",
          body: input,
        },
      );
      persist({ token: res.accessToken, customer: res.customer });
    },
    [persist],
  );

  const register = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      cep: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
    }) => {
      const res = await apiRequest<{ customer: Customer; accessToken: string }>(
        {
          path: "/api/auth/register",
          method: "POST",
          body: input,
        },
      );
      persist({ token: res.accessToken, customer: res.customer });
    },
    [persist],
  );

  const logout = useCallback(() => {
    setState({ token: null, customer: null });
    removeKey(STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, register, logout }),
    [state, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext ausente");
  return ctx;
}
