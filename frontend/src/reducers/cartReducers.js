import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
 switch (action.type) {
  case CART_ADD_ITEM:
   const item = action.payload;

   const existItem = state.cartItems.find((X) => X.product === item.product);

   if (existItem) {
    return {
     ...state,
     cartItems: state.cartItems.map((X) =>
      X.product === existItem.product ? item : X
     ),
    };
   } else {
    return {
     ...state,
     cartItems: [...state.cartItems, item],
    };
   }
  case CART_REMOVE_ITEM:
   return {
    ...state,
    cartItems: state.cartItems.filter((X) => X.product !== action.payload),
   };
  default:
   return state;
 }
};
