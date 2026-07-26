import axios from "../axios";
import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData:() =>{},
  updateStockQuantity: (productId, newQuantity) =>{}
  
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);


  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) => {
        if (index !== existingProductIndex) return item;
        if (item.quantity >= item.stockQuantity) {
          alert("Cannot add more than available stock");
          return item;
        }
        return { ...item, quantity: item.quantity + 1 };
      });
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // product.quantity is the STOCK quantity coming from the backend.
      // Keep it as stockQuantity so it doesn't collide with the cart's
      // own "how many did the user add" quantity below.
      const updatedCart = [
        ...cart,
        { ...product, stockQuantity: product.quantity, quantity: 1 },
      ];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (productId) => {
    // productId may arrive as a string (e.g. from useParams) or a number
    // (from a product object), so compare loosely by normalizing both.
    const updatedCart = cart.filter((item) => Number(item.id) !== Number(productId));
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const refreshData = async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  const clearCart =() =>{
    setCart([]);
  }
  
  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  return (
    <AppContext.Provider value={{ data, isError, cart, addToCart, removeFromCart,refreshData, clearCart  }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;