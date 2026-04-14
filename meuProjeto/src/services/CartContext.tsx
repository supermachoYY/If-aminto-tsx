import React, { createContext, useState, ReactNode } from "react";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  userId?: string; // ID do vendedor
}

interface CartContextType {
  cart: CartItem[];
  adicionarAoCarrinho: (produto: any) => void;
  removerItem: (id: string) => void;
  limparCarrinho: () => void;
}

export const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function adicionarAoCarrinho(produto: any) {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === produto.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
          userId: produto.userId, // Guarda quem vendeu
        },
      ];
    });
  }

  function removerItem(id: string) {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }

  function limparCarrinho() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{ cart, adicionarAoCarrinho, removerItem, limparCarrinho }}
    >
      {children}
    </CartContext.Provider>
  );
}