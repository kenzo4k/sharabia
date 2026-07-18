export const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART'
};

export default function CartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const newItem = action.payload;
      
      // Find index of item matching productId, size, and color
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      let updatedItems = [...state.items];

      if (existingItemIndex > -1) {
        // Increment quantity of existing item
        const existingItem = state.items[existingItemIndex];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + newItem.quantity
        };
      } else {
        // Add new item
        updatedItems.push(newItem);
      }

      return {
        ...state,
        items: updatedItems
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const indexToRemove = action.payload;
      const updatedItems = state.items.filter((_, index) => index !== indexToRemove);
      
      return {
        ...state,
        items: updatedItems
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { index, quantity } = action.payload;
      let updatedItems = [...state.items];
      
      if (updatedItems[index]) {
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: Math.max(1, quantity) // Ensure quantity is at least 1
        };
      }

      return {
        ...state,
        items: updatedItems
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: []
      };
    }

    default:
      return state;
  }
}
