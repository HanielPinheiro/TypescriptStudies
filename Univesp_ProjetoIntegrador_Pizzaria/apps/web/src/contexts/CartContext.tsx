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
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  priceCents: number;
  quantity: number;
  notes: string;
  pizza?: {
    flavorIds: string[];
    stuffedCrust: boolean;
  };
};

type CartState = {
  items: CartItem[];
};

type CartContextValue = CartState & {
  addItem: (item: {
    productId: string;
    name: string;
    imageUrl: string;
    priceCents: number;
    quantity?: number;
    notes?: string;
    pizza?: { flavorIds: string[]; stuffedCrust: boolean };
  }) => void;
  setQuantity: (id: string, quantity: number) => void;
  setNotes: (id: string, notes: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  totalCents: number;
  totalItems: number;
};

const STORAGE_KEY = "pizzaria.cart";

const CartContext = createContext<CartContextValue | null>(null);

function createLineId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto.randomUUID as () => string)();
  }
  return `line_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isSamePizza(
  a?: { flavorIds: string[]; stuffedCrust: boolean },
  b?: { flavorIds: string[]; stuffedCrust: boolean },
): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.stuffedCrust !== b.stuffedCrust) return false;
  if (a.flavorIds.length !== b.flavorIds.length) return false;
  for (let idx = 0; idx < a.flavorIds.length; idx += 1) {
    if (a.flavorIds[idx] !== b.flavorIds[idx]) return false;
  }
  return true;
}

export function CartProvider(props: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(() => {
    const raw = readJson<{ items?: unknown }>(STORAGE_KEY);
    const rawItems =
      raw && typeof raw === "object"
        ? (raw as { items?: unknown }).items
        : undefined;
    const items: CartItem[] = [];
    if (Array.isArray(rawItems)) {
      for (const i of rawItems) {
        if (!i || typeof i !== "object") continue;
        const obj = i as Partial<CartItem>;
        if (typeof obj.productId !== "string") continue;
        if (typeof obj.name !== "string") continue;
        if (typeof obj.imageUrl !== "string") continue;
        if (typeof obj.priceCents !== "number") continue;
        const quantity = typeof obj.quantity === "number" ? obj.quantity : 1;
        const notes = typeof obj.notes === "string" ? obj.notes : "";
        const id = typeof obj.id === "string" ? obj.id : createLineId();
        const pizza =
          obj.pizza &&
          typeof obj.pizza === "object" &&
          Array.isArray((obj.pizza as { flavorIds?: unknown }).flavorIds) &&
          typeof (obj.pizza as { stuffedCrust?: unknown }).stuffedCrust ===
            "boolean"
            ? {
                flavorIds: (obj.pizza as { flavorIds: string[] }).flavorIds,
                stuffedCrust: (obj.pizza as { stuffedCrust: boolean })
                  .stuffedCrust,
              }
            : undefined;

        const next: CartItem = {
          id,
          productId: obj.productId,
          name: obj.name,
          imageUrl: obj.imageUrl,
          priceCents: obj.priceCents,
          quantity,
          notes,
        };
        if (pizza) next.pizza = pizza;
        items.push(next);
      }
    }

    return { items };
  });

  const persist = useCallback((next: CartState) => {
    setState(next);
    writeJson(STORAGE_KEY, next);
  }, []);

  const addItem = useCallback(
    (item: {
      productId: string;
      name: string;
      imageUrl: string;
      priceCents: number;
      quantity?: number;
      notes?: string;
      pizza?: { flavorIds: string[]; stuffedCrust: boolean };
    }) => {
      const notes = item.notes ?? "";
      const quantity = item.quantity ?? 1;
      const existing = state.items.find(
        (i) =>
          i.productId === item.productId &&
          i.notes === notes &&
          isSamePizza(i.pizza, item.pizza),
      );
      if (existing) {
        persist({
          items: state.items.map((i) =>
            i.id === existing.id
              ? {
                  ...i,
                  quantity: Math.max(1, Math.min(99, i.quantity + quantity)),
                }
              : i,
          ),
        });
        return;
      }
      persist({
        items: [
          ...state.items,
          {
            id: createLineId(),
            productId: item.productId,
            name: item.name,
            imageUrl: item.imageUrl,
            priceCents: item.priceCents,
            quantity: Math.max(1, Math.min(99, quantity)),
            notes,
            pizza: item.pizza,
          },
        ],
      });
    },
    [persist, state.items],
  );

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      const nextQuantity = Math.max(1, Math.min(99, quantity));
      persist({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: nextQuantity } : i,
        ),
      });
    },
    [persist, state.items],
  );

  const setNotes = useCallback(
    (id: string, notes: string) => {
      persist({
        items: state.items.map((i) => (i.id === id ? { ...i, notes } : i)),
      });
    },
    [persist, state.items],
  );

  const removeItem = useCallback(
    (id: string) => {
      persist({ items: state.items.filter((i) => i.id !== id) });
    },
    [persist, state.items],
  );

  const clear = useCallback(() => {
    setState({ items: [] });
    removeKey(STORAGE_KEY);
  }, []);

  const totalCents = useMemo(
    () => state.items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    [state.items],
  );
  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items],
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
    ],
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
