import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readJson, removeKey, writeJson } from "../lib/storage";

export type CartItem = {
  productId: string;
  name: string;
  imageUrl: string;
  priceCents: number;
  quantity: number;
  notes: string;
};

type CartState = {
  items: CartItem[];
};

type CartContextValue = CartState & {
  addItem: (item: Omit<CartItem, "quantity" | "notes">) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setNotes: (productId: string, notes: string) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  totalCents: number;
  totalItems: number;
};

const STORAGE_KEY = "pizzaria.cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider(props: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(
    () => readJson<CartState>(STORAGE_KEY) ?? { items: [] }
  );

  const persist = useCallback((next: CartState) => {
    setState(next);
    writeJson(STORAGE_KEY, next);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity" | "notes">) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        persist({
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        });
        return;
      }
      persist({ items: [...state.items, { ...item, quantity: 1, notes: "" }] });
    },
    [persist, state.items]
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const nextQuantity = Math.max(1, Math.min(99, quantity));
      persist({
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity: nextQuantity } : i
        ),
      });
    },
    [persist, state.items]
  );

  const setNotes = useCallback(
    (productId: string, notes: string) => {
      persist({
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, notes } : i
        ),
      });
    },
    [persist, state.items]
  );

  const removeItem = useCallback(
    (productId: string) => {
      persist({ items: state.items.filter((i) => i.productId !== productId) });
    },
    [persist, state.items]
  );

  const clear = useCallback(() => {
    setState({ items: [] });
    removeKey(STORAGE_KEY);
  }, []);

  const totalCents = useMemo(
    () => state.items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    [state.items]
  );
  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      addItem,
      setQuantity,
      setNotes,
      removeItem,
      clear,
      totalCents,
      totalItems,
    }),
    [
      state,
      addItem,
      setQuantity,
      setNotes,
      removeItem,
      clear,
      totalCents,
      totalItems,
    ]
  );

  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("CartContext ausente");
  return ctx;
}
