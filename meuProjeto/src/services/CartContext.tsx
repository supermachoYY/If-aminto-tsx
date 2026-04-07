import React, { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  function adicionarAoCarrinho(produto){

    const itemExistente = cart.find(item => item.id === produto.id);

    if(itemExistente){

      if(itemExistente.quantidade >= 3){
        alert("Máximo de 3 unidades por lanche");
        return;
      }

      const novoCarrinho = cart.map(item =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      );

      setCart(novoCarrinho);

    } else {

      setCart([...cart, { ...produto, quantidade: 1 }]);

    }

  }

  function removerItem(id){

    const novoCarrinho = cart.filter(item => item.id !== id);

    setCart(novoCarrinho);
  }

  return (

    <CartContext.Provider
      value={{
        cart,
        adicionarAoCarrinho,
        removerItem
      }}
    >

      {children}

    </CartContext.Provider>

  );

}