import { createAction } from './actionCreater';
import { CART_ACTION_TYPES } from '../constants/actionTypes';

const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.bookId === productToAdd.bookId
  );

  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.bookId === productToAdd.bookId && cartItem.flag !== 'R'
        ? {
            ...cartItem,
            quantity: cartItem.quantity + 1,
            totalPrice: (cartItem.quantity + 1) * cartItem.price,
          }
        : cartItem
    );
  }

  return [
    ...cartItems,
    {
      ...productToAdd,
      quantity: 1,
      totalPrice: productToAdd.price,
    },
  ];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
  // find the cart item to remove
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.bookId === cartItemToRemove.bookId
  );

  // check if quantity is equal to 1, if it is remove that item from the cart
  if (existingCartItem.quantity === 1) {
    return cartItems.filter(
      (cartItem) => cartItem.bookId !== cartItemToRemove.bookId
    );
  }

  // return back cartitems with matching cart item with reduced quantity
  return cartItems.map((cartItem) =>
    cartItem.bookId === cartItemToRemove.bookId
      ? {
          ...cartItem,
          quantity: cartItem.quantity - 1,
          totalPrice: (cartItem.quantity - 1) * cartItem.price,
        }
      : cartItem
  );
};

const clearCartItem = (cartItems, cartItemToClear) =>
  cartItems.filter((cartItem) => cartItem.bookId !== cartItemToClear.bookId);

const emptyCart = (cartItems) => (cartItems = []);

export const addItemToCart = (cartItems, productToAdd) => {
  const newCartItems = addCartItem(cartItems, productToAdd);
  return createAction(CART_ACTION_TYPES.SET_CART_ITEMS, newCartItems);
};

export const removeItemFromCart = (cartItems, cartItemToRemove) => {
  const newCartItems = removeCartItem(cartItems, cartItemToRemove);
  return createAction(CART_ACTION_TYPES.SET_CART_ITEMS, newCartItems);
};

export const clearItemFromCart = (cartItems, cartItemToClear) => {
  const newCartItems = clearCartItem(cartItems, cartItemToClear);
  return createAction(CART_ACTION_TYPES.SET_CART_ITEMS, newCartItems);
};

export const setIsCartOpen = (boolean) =>
  createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, boolean);

export const clearCart = (cartItems) => {
  const newCartItems = emptyCart(cartItems);
  return createAction(CART_ACTION_TYPES.CLEAR_CART, cartItems);
};
