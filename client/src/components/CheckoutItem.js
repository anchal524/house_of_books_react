import { useDispatch, useSelector } from 'react-redux';

import {
  clearItemFromCart,
  addItemToCart,
  removeItemFromCart,
} from '../store/actions/cartAction';
import { selectCartItems } from '../store/selector/cartSelector';

import '../styles/CheckoutItem.scss';

const CheckoutItem = ({ cartItem }) => {
  console.log('CartItemscheckout', cartItem);
  const { name, imageUrl, price, quantity, flag } = cartItem;
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const clearItemHandler = () =>
    dispatch(clearItemFromCart(cartItems, cartItem));
  const addItemHandler = () => dispatch(addItemToCart(cartItems, cartItem));
  const removeItemHandler = () =>
    dispatch(removeItemFromCart(cartItems, cartItem));

  return (
    <div className='checkout-item-container'>
      <div className='image-container'>
        <img src={imageUrl} alt={`${name}`} />
      </div>
      <span className='base-span'>{name}</span>
      <span className='quantity'>
        <span className='arrow' onClick={removeItemHandler}>
          &#10094;
        </span>
        <span className='value'>{quantity}</span>
        <span className='arrow' onClick={addItemHandler}>
          &#10095;
        </span>
      </span>
      <span className='base-span'>{quantity * price}</span>
      <div className='remove-button' onClick={clearItemHandler}>
        &#10005;
      </div>
      {flag === 'R' ? (
        <span className='base-span'>Rent</span>
      ) : (
        <span className='base-span'>Buy</span>
      )}
    </div>
  );
};

export default CheckoutItem;
