import * as React from 'react';
import CartReducer, { CART_ACTIONS } from './CartReducer';
import { toast } from 'sonner';

const CartContext = React.createContext(null);

const initialState = {
  items: []
};

// Initial state loader from localStorage
const getInitialState = () => {
  try {
    const savedCart = localStorage.getItem('sharabia_cart');
    return savedCart ? JSON.parse(savedCart) : initialState;
  } catch (err) {
    console.error('Error loading cart from localStorage', err);
    return initialState;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = React.useReducer(CartReducer, null, getInitialState);

  // Sync with localStorage on changes
  React.useEffect(() => {
    localStorage.setItem('sharabia_cart', JSON.stringify(state));
  }, [state]);

  // Derived values
  const cart = state.items;
  
  const cartTotal = React.useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = React.useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Actions
  const addItem = (item) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
    
    if (window.trackAnalyticsEvent) {
      window.trackAnalyticsEvent('cart_add', `/product/${item.slug || ''}`);
    }
    
    // Trigger success toast
    toast.success(`Added ${item.name} (${item.quantity}) to cart!`, {
      description: `${item.size ? `Size: ${item.size}` : ''} ${item.color ? `• Color: ${item.color}` : ''}`,
      style: {
        background: '#162A3E',
        color: '#F0ECE3',
        borderColor: '#B87333'
      }
    });
  };

  const removeItem = (index) => {
    const item = cart[index];
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: index });
    
    if (item) {
      toast.error(`Removed ${item.name} from cart.`, {
        style: {
          background: '#162A3E',
          color: '#F0ECE3',
          borderColor: '#EF4444'
        }
      });
    }
  };

  const updateQuantity = (index, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { index, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        cartCount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
