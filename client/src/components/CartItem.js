import noImage from '../assets/images/no-image.jpeg';
import '../styles/CartItem.scss';

const CartItem = ({ cartItem }) => {
  const { name, imageUrl, price, quantity } = cartItem;
  return (
    <div className='cart-item-container'>
      <img src={imageUrl ? imageUrl : noImage} alt={`${name}`} />
      <div className='item-details'>
        <span>{name.substring(0, 10)}...</span>
        <span>
          {quantity} x ${price}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
